import { useState } from 'react'
import Router from 'next/router'
import PageShell from '@/components/PageShell'
import { Input, Textarea, Text, Box, Heading, useColorModeValue, Button, useToast } from '@chakra-ui/react'
import { highlight_color } from '@/styles/colorModeValue'
import { Toast, ToastError } from '@/components/Toast'

const Contact = () => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    subject: '',
    honeypot: '',
    message: '',
  })

  const [{ error }, setError] = useState({ error: { email: '' } })
  const [response, setResponse] = useState({ type: '', message: '', })
  const toast = useToast()

  const validate = (input) => {
    // Ref : https://emailregex.com/
    const regexEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i

    if (input.target.name === 'email') {
      if (input.target.value === '') { return setError({ error: { email: '' } }) }
      if (!regexEmail.test(input.target.value)) {
        setError({ error: { email: 'Emailアドレスをご入力ください。' } })
      } else {
        setError({ error: { email: '' } })
      }
    }
  }

  const handleChange = e => {
    if (e.target.name === 'subject') setContact({ ...contact, [e.target.name]: `【アーカイブアプリ】${e.target.value}` })
    else { setContact({ ...contact, [e.target.name]: e.target.value }) }
    validate(e)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(contact),
        headers: { 'Content-Type': 'application/json' },
      })

      const json = await res.json()
      if (json.success) {
        //成功したらsuccessページに飛ぶ
        Router.push('/contact_success')
      } else {
        setResponse({
          type: 'error',
          message: '送信中にエラーが発生しました。',
        })
        toast({
          status: 'error',
          isClosable: true,
          duration: 9000,
          render: () => (<ToastError text={"送信中にエラーが発生しました。"} />)
        })
      }

    } catch (e) {
      setResponse({
        type: 'error',
        message: 'メッセージは送信されませんでした。',
      })
      toast({
        status: 'error',
        isClosable: true,
        duration: 9000,
        render: () => (<ToastError text={"メッセージは送信されませんでした。"} />)
      })
    }
  }

  const highlightColor = useColorModeValue(highlight_color.l, highlight_color.d)

  return (
    <PageShell customPT={null} customSpacing={null}>
      <Box w='full' maxW='640px'>
        <Text>{response.message}</Text>
        <Box>
          <Heading as='h2' fontSize='2xl' mb={16}>お問い合わせ</Heading>
          <form
            action="https://api.staticforms.xyz/submit"
            method="post"
            onSubmit={handleSubmit}>
            <Text mt={6} mb={0} >お名前</Text>
            <Input
              mb={3}
              variant="flushed"
              borderColor='gray.500'
              focusBorderColor={highlightColor}
              type="text"
              name="name"
              onChange={handleChange}
              required
            />
            <Text mt={6} mb={0} >メールアドレス</Text>
            <Input
              mb={3}
              variant="flushed"
              borderColor='gray.500'
              focusBorderColor={highlightColor}
              type="email"
              name="email"
              onChange={handleChange}
              required
            />
            {error.email && <Text color={highlightColor} fontSize='sm'>{error.email}</Text>}
            <Text mt={6} mb={0}>件名</Text>
            <Input
              mb={3}
              variant="flushed"
              borderColor='gray.500'
              focusBorderColor={highlightColor}
              type="text"
              name="subject"
              onChange={handleChange}
              required
            />
            {/* <Input type="hidden" name="subject" onChange={handleChange} /> */}
            <Text mt={6} mb={3}>メッセージ</Text>
            <Textarea
              name="message"
              borderColor='gray.500'
              focusBorderColor={highlightColor}
              onChange={handleChange}
              size="xl"
              rows={10}
              px={4}
              py={2}
              lineHeight={1.6}
              mb={10}
              required
            />
            <Button
              color='white'
              bg='#69b578'
              size='sm'
              type="submit"
              onClick={() => {
                toast({ duration: 3000, render: () => (<Toast text={"メールを送信中..."} />) })
              }}>送信</Button>
          </form>
        </Box>
      </Box>
    </PageShell>
  )
}

export default Contact