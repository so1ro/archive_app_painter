import React from 'react';
import {
	Button,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useColorModeValue,
} from "@chakra-ui/react"
import { highlight_color, text_humble_color } from '@/styles/colorModeValue';

export default function Alert({ buttonText, onDelete }: { buttonText?: string, onDelete?: () => void }) {
	const [isOpen, setIsOpen] = React.useState(false)
	const onClose = () => setIsOpen(false)
	const cancelRef = React.useRef()

	const highlightColor = useColorModeValue(highlight_color.l, highlight_color.d)
	const texthumbleColor = useColorModeValue(text_humble_color.l, text_humble_color.d)

	return (
		<>
			<Button size="xs" fontSize='xs' color={texthumbleColor} borderWidth='1px'
				borderColor={useColorModeValue('gray.200', '#172128')} onClick={() => setIsOpen(true)}>
				{buttonText}
			</Button>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							お気に入りを削除
						</AlertDialogHeader>

						<AlertDialogBody>
							お気に入りをすべて削除します。この操作は元に戻せません。削除してもよろしいでしょうか？
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose}>
								キャンセル
							</Button>
							<Button color='white' bgColor='#e63946' onClick={() => { onClose(), onDelete() }} ml={3}>
								削除
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	)
}