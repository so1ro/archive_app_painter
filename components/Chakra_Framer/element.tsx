import { motion, HTMLMotionProps } from "framer-motion"
import { HTMLChakraProps, chakra } from "@chakra-ui/react"
import { Stack } from "@chakra-ui/react"
import { Box, BoxProps } from '@chakra-ui/layout';

type Merge<P, T> = Omit<P, keyof T> & T;

// MotionBox
export const MotionBox = motion<BoxProps>(Box)

// MotionLink - Modal Menu
type MotionLinkProps = Merge<HTMLChakraProps<"a">, HTMLMotionProps<"a">>;
export const MotionLink: React.FC<MotionLinkProps> = motion(chakra.a);

// MotionIconStack - Modal Menu
// type MotionIconStackProps = Merge<HTMLChakraProps<"div">, HTMLMotionProps<"div">>;
export const MotionIconStack = motion(Stack);

// MotionButton - Top
type MotionButtonProps = Merge<HTMLChakraProps<"button">, HTMLMotionProps<"button">>;
export const MotionButton: React.FC<MotionButtonProps> = motion(chakra.button);

// MotionIconBox - Top
type MotionIconBoxProps = Merge<HTMLChakraProps<"div">, HTMLMotionProps<"div">>;
export const MotionIconBox: React.FC<MotionIconBoxProps> = motion(chakra.div);
// export const MotionIconBox = motion(Box);