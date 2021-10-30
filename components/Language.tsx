import { Select } from "@chakra-ui/react"
import { upperCase } from "lodash"
import { useRouter } from 'next/router'

export default function Language() {
	const router = useRouter()
	const { locale, asPath } = router
	const handleLanguage = (e) => {
		const locale = e.target.value
		router.push(asPath, asPath, { locale })
	}

	return (
		<Select
			onChange={handleLanguage}
			d={{ base: 'none', sm: 'inline-block' }}
			placeholder={upperCase(locale)} w='none' border='0'
			style={{ paddingInlineStart: '0' }}>
			{locale !== 'en' && <option value="en">EN</option>}
			{locale !== 'ja' && <option value="ja">JA</option>}
		</Select>
	)
}