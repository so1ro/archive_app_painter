import Image from 'next/image'
import { Box } from "@chakra-ui/layout"
import Slider from "react-slick"


export default function SlickSlider({ imgs, h }) {
	const settings = {
		infinite: true,
		speed: 5000,
		fade: true,
		slidesToShow: 1,
		autoplay: true,
		slidesToScroll: 1,
	}
	return (
		<Slider {...settings}>
			{imgs.map(img => (
				<Box pos='relative' h={h} key={img.sys.id}>
					<Image src={img.url}
						layout="fill"
						objectFit="cover"
						quality={100}
						priority={true}
						alt='芝田美智子 ボタニカルアート' />
				</Box>
			))}
		</Slider>
	)
}

// <Box h={h} w='full'>
// 				<Image src={img[0].url}
// 					layout="fixed"
// 					width={w}
// 					height={h}
// 					// objectFit="cover"
// 					quality={100}
// 					priority={true}
// 					alt='芝田美智子 ボタニカルアート' />
// 			</Box>