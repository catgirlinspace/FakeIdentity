import client from '@/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import React, { useRef, useState } from 'react'

export function APITester() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null)
  const [endpoint, setEndpoint] = useState('/api/hello')
  const [method, setMethod] = useState<'GET' | 'PUT'>('GET')

  const testEndpoint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      // Parse the endpoint to extract path and params
      const path = endpoint.replace(/^\/api\//, '')
      let result: { data: unknown; error: unknown }

      if (path === 'hello') {
        result = method === 'GET'
          ? await client.hello.get()
          : await client.hello.put()
      } else if (path.startsWith('hello/')) {
        const name = path.replace('hello/', '')
        result = await client.hello({ name }).get()
      } else {
        throw new Error(`Unknown endpoint: ${endpoint}`)
      }

      if (result.error) {
        responseInputRef.current!.value = `Error: ${JSON.stringify(result.error, null, 2)}`
      } else {
        responseInputRef.current!.value = JSON.stringify(result.data, null, 2)
      }
    } catch (error) {
      responseInputRef.current!.value = String(error)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={testEndpoint} className="flex items-center gap-2">
        <Label htmlFor="method" className="sr-only">
          Method
        </Label>
        <Select value={method} onValueChange={(v) => setMethod(v as 'GET' | 'PUT')}>
          <SelectTrigger className="w-[100px]" id="method">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="endpoint" className="sr-only">
          Endpoint
        </Label>
        <Input
          id="endpoint"
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="/api/hello"
        />
        <Button type="submit" variant="default">
          Send
        </Button>
      </form>
      <Label htmlFor="response" className="sr-only">
        Response
      </Label>
      <Textarea
        ref={responseInputRef}
        id="response"
        readOnly
        placeholder="Response will appear here..."
        className="min-h-[140px] font-mono resize-y"
      />
    </div>
  )
}
