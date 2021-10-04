import PageShell from "@/components/PageShell"
import { Center } from "@chakra-ui/react"
import { useRouter } from "next/router"


const Success = () => {

	const { locale } = useRouter()

	return (
		<PageShell customPT={null} customSpacing={null}>
			{locale === 'en' ?
				<Center> You message was successfully sent. <br />Please wait for reply. Thank you!</Center> :
				<Center> メールが送信されました。<br />お返事いたしますので、少々お待ち下さい。 </Center>}
		</PageShell>
	)
}

export default Success