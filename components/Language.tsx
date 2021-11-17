import { Menu, MenuButton, MenuList, MenuItem, } from "@chakra-ui/react"
import { upperCase } from "lodash"
import { useRouter } from 'next/router'
import { ChevronDownIcon } from "@chakra-ui/icons"

export default function Language() {
	const router = useRouter()
	const { locale, asPath } = router
	const handleLanguage = (e) => {
		const locale = e.target.value
		router.push(asPath, asPath, { locale })
	}

	return (
		<Menu autoSelect={false}>
			<MenuButton
				aria-label="Options"
				pr={{ base: 0, lg: 2 }}
				transform={{ base: 'translateX(8%)', lg: 'none' }}
				bg='none'
				alignItems='center'
				_expanded={{ bg: "none" }}
				_focus={{ bg: "none" }}
			>
				{upperCase(locale)} <ChevronDownIcon />
			</MenuButton>
			<MenuList zIndex='3' w='60px'>
				<MenuItem onClick={handleLanguage} value="en">EN</MenuItem>
				<MenuItem onClick={handleLanguage} value="ja">JA</MenuItem>
			</MenuList>
		</Menu>
	)
}