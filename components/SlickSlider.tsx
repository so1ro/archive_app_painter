import Image from 'next/image'
import { Box } from "@chakra-ui/layout"
import Slider from "react-slick"


export default function SlickSlider({ img, h }) {
	const settings = {
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		autoplay: true,
		slidesToScroll: 1,
		// adaptiveHeight: true,
	}
	return (
		<Slider {...settings}>
			<Box pos='relative' h={h}>
				<Image src={img[0].url}
					layout="fill"
					objectFit="cover"
					quality={50}
					priority={true}
					alt='スーツ' />
			</Box>
			<Box pos='relative' h={h}>
				<Image src={img[0].url}
					layout="fill"
					objectFit="cover"
					quality={50}
					priority={true}
					alt='スーツ' />
			</Box>
			<Box pos='relative' h={h}>
				<Image src={img[0].url}
					layout="fill"
					objectFit="cover"
					quality={50}
					priority={true}
					alt='スーツ' />
			</Box>
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
// 					alt='スーツ' />
// 			</Box>