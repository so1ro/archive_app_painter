import PageShell from "@/components/PageShell"
import { Center } from "@chakra-ui/react"

const Success = () => {

	return (
		<PageShell customPT={null} customSpacing={null}>
			<Center>メールが送信されました。<br />お返事いたしますので、少々お待ち下さい。</Center>
		</PageShell>
	)
}

export default Success