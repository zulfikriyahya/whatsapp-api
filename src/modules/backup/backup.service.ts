import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import { pipeline } from "stream";

const execAsync = promisify(exec);
const pipelineAsync = promisify(pipeline);

/**
 * BackupService:
 * 1. Backup database MySQL via mysqldump — harian jam 03:00 WIB
 * 2. Backup folder auth sessions (whatsapp-web.js) — harian jam 03:30 WIB
 * 3. Retention: simpan 7 backup terakhir, hapus yang lebih lama
 *
 * Env yang dibutuhkan (otomatis dari DATABASE_URL):
 *   DATABASE_URL=mysql://user:pass@host:port/dbname
 *
 * Opsional: BACKUP_PATH (default: ./storage/backups)
 */
@Injectable()
export class BackupService {
  private logger = new Logger("BackupService");
  private backupPath: string;
  private dbBackupPath: string;
  private sessionBackupPath: string;

  constructor(private cfg: ConfigService) {
    this.backupPath = cfg.get<string>("BACKUP_PATH") || "./storage/backups";
    this.dbBackupPath = path.join(this.backupPath, "database");
    this.sessionBackupPath = path.join(this.backupPath, "sessions");

    fs.mkdirSync(this.dbBackupPath, { recursive: true });
    fs.mkdirSync(this.sessionBackupPath, { recursive: true });
  }

  // Backup database — 03:00 WIB (20:00 UTC)
  @Cron("0 20 * * *")
  async backupDatabase() {
    this.logger.log("Starting database backup...");
    try {
      const dbUrl = this.cfg.get<string>("database.url");
      const parsed = this.parseDbUrl(dbUrl);
      if (!parsed) {
        this.logger.error("Cannot parse DATABASE_URL for backup");
        return;
      }

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      const dumpFile = path.join(
        this.dbBackupPath,
        `backup_${timestamp}.sql.gz`,
      );

      // mysqldump → gzip
      const { user, password, host, port, database } = parsed;
      const envPass = password ? `MYSQL_PWD="${password}"` : "";
      const cmd = `${envPass} mysqldump -u ${user} -h ${host} -P ${port} --single-transaction --routines --triggers ${database}`;

      const child = exec(cmd);
      const gzip = zlib.createGzip();
      const output = fs.createWriteStream(dumpFile);

      await pipelineAsync(child.stdout!, gzip, output);

      const sizeMb = (fs.statSync(dumpFile).size / 1024 / 1024).toFixed(2);
      this.logger.log(
        `Database backup complete: ${path.basename(dumpFile)} (${sizeMb} MB)`,
      );

      await this.pruneOldBackups(this.dbBackupPath, 7);
    } catch (e) {
      this.logger.error(`Database backup failed: ${e.message}`);
    }
  }

  // Backup session folders — 03:30 WIB (20:30 UTC)
  @Cron("30 20 * * *")
  async backupSessions() {
    this.logger.log("Starting sessions backup...");
    try {
      const authPath = this.cfg.get<string>("whatsapp.authPath");
      if (!fs.existsSync(authPath)) {
        this.logger.warn("Auth path not found, skipping session backup");
        return;
      }

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      const archiveFile = path.join(
        this.sessionBackupPath,
        `sessions_${timestamp}.tar.gz`,
      );

      await execAsync(
        `tar -czf "${archiveFile}" -C "${path.dirname(authPath)}" "${path.basename(authPath)}"`,
      );

      const sizeMb = (fs.statSync(archiveFile).size / 1024 / 1024).toFixed(2);
      this.logger.log(
        `Sessions backup complete: ${path.basename(archiveFile)} (${sizeMb} MB)`,
      );

      await this.pruneOldBackups(this.sessionBackupPath, 7);
    } catch (e) {
      this.logger.error(`Sessions backup failed: ${e.message}`);
    }
  }

  // Hapus backup lama, simpan N terbaru
  private async pruneOldBackups(dir: string, keep: number) {
    const files = fs
      .readdirSync(dir)
      .map((f) => ({ name: f, time: fs.statSync(path.join(dir, f)).mtimeMs }))
      .sort((a, b) => b.time - a.time);

    const toDelete = files.slice(keep);
    for (const f of toDelete) {
      fs.unlinkSync(path.join(dir, f.name));
      this.logger.debug(`Pruned old backup: ${f.name}`);
    }
  }

  private parseDbUrl(url: string) {
    try {
      // mysql://user:pass@host:port/dbname
      const match = url.match(/mysql:\/\/([^:]+):([^@]*)@([^:]+):(\d+)\/(.+)/);
      if (!match) return null;
      return {
        user: match[1],
        password: decodeURIComponent(match[2]),
        host: match[3],
        port: match[4],
        database: match[5].split("?")[0],
      };
    } catch {
      return null;
    }
  }
}
