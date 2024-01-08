'use client'

import { FormEvent, useState } from 'react'
import { useAleoWASM } from '@/app/hooks/aleo-wasm-hook'

export default function Record() {

  const [plaintext, setPlaintext] = useState('')
  const [_isOwner, setIsOwner] = useState(false)
  const [aleo] = useAleoWASM()

  const [ciphertext, setCiphertext] = useState('')
  const [viewKey, setViewKey] = useState('AViewKey1op7dkWUdf2RYRgBzNT3UN7xqKPeZGi5uZneg4699xVrY')

  const onCiphertextChange = (event: any) => {
    setCiphertext('')
    try {
      setCiphertext(event.target.value)
      tryDecrypt(event.target.value, viewKey)
    } catch (error) {
      console.error(error)
    }
  }

  const onViewKeyChange = (event: any) => {
    setViewKey('')
    try {
      setViewKey(event.target.value)
      tryDecrypt(ciphertext, event.target.value)
    } catch (error) {
      console.error(error)
    }
  }

  const tryDecrypt = (ciphertext: string, viewKey: string) => {
    setPlaintext('')
    try {
      // Check if we have a ciphertext and a view key, and if so, decrypt the ciphertext.
      if (ciphertext && viewKey) {
        setPlaintext(
          aleo.ViewKey.from_string(viewKey).decrypt(ciphertext),
        )
        setIsOwner(true)
      }
    } catch (error) {
      console.warn(error)
      try {
        // If the ciphertext is valid, but the view key is not, then we can still display the info about ownership
        aleo.RecordCiphertext.fromString(ciphertext)
        setIsOwner(false)
      } catch (error) {
        // If the ciphertext is invalid, then we can't display any info about ownership or the plaintext content
        setIsOwner(false)
        console.warn(error)
      }
      if (plaintext !== null) {
        setPlaintext('')
      }
    }
  }

  return (
    <form
      className="mt-10 flex flex-col gap-4 max-w-2xl"
    >
      <div className="flex flex-col gap-4">
        <label htmlFor="recordCiphertext">Record (Ciphertext)</label>
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4"
          placeholder="Record (Ciphertext)"
          id="recordCiphertext"
          type="text"
          autoComplete="off"
          onChange={(event: FormEvent) =>
            onCiphertextChange(event)
          }
          value={ciphertext}
          required
        />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="viewKey">View Key</label>
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4"
          placeholder="Your PRIVATE view key"
          id="viewKey"
          type="text"
          autoComplete="off"
          onChange={(event: FormEvent) =>
            onViewKeyChange(event)
          }
          value={viewKey}
          required
        />
      </div>

      <div className="flex flex-col gap-4">
        <label htmlFor="decryptedRecord">Decrypted Record</label>
        <textarea
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4 min-h-[250px]"
          placeholder="Record (Plaintext)"
          id="decryptedRecord"
          value={plaintext}
          required
          disabled
        />
      </div>
    </form>
  )
}
