// src/app/(dashboard)/messages/send/page.tsx
'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/common/page-header'
import { SendMessageForm } from '@/components/messages/send-message-form'
import { SendMediaForm } from '@/components/messages/send-media-form'
import { SendLocationForm } from '@/components/messages/send-location-form'
import { SendPollForm } from '@/components/messages/send-poll-form'
import { CheckNumberForm } from '@/components/messages/check-number-form'

const TABS = [
  { value: 'text', label: 'Teks' },
  { value: 'media', label: 'Media' },
  { value: 'location', label: 'Lokasi' },
  { value: 'poll', label: 'Poll' },
  { value: 'contact', label: 'Kontak' },
  { value: 'voice', label: 'Voice Note' },
]

export default function SendMessagePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Kirim Pesan"
        description="Kirim berbagai tipe pesan ke nomor WhatsApp"
      />
      <CheckNumberForm />
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="text">
            <TabsList className="mb-6 flex h-auto flex-wrap gap-1">
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="text-xs">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="text">
              <SendMessageForm />
            </TabsContent>
            <TabsContent value="media">
              <SendMediaForm />
            </TabsContent>
            <TabsContent value="location">
              <SendLocationForm />
            </TabsContent>
            <TabsContent value="poll">
              <SendPollForm />
            </TabsContent>
            <TabsContent value="contact">
              <div className="bg-muted/50 text-muted-foreground rounded-md p-4 text-center text-sm">
                Form kirim kontak akan ditambahkan pada batch berikutnya.
              </div>
            </TabsContent>
            <TabsContent value="voice">
              <div className="bg-muted/50 text-muted-foreground rounded-md p-4 text-center text-sm">
                Form kirim voice note akan ditambahkan pada batch berikutnya.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
