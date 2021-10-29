import React from 'react';
import { Box, Center } from "@chakra-ui/react"
import { css } from "@emotion/react"
import { useColorModeValue } from "@chakra-ui/react"
import { text_BW, menuButton_bg_color } from '@/styles/colorModeValue'
import { useRouter } from 'next/router'

export default function Btn_hamburg({ onHandler, isOpen }: { onHandler: () => void | null, isOpen: boolean }) {

  const router = useRouter()
  const isArvhiveContent = router.pathname.includes('/archive') || router.pathname.includes('/youtube')

  // Position
  const btnPosition = [4, 6]
  // Adjust Size etc
  const hamburger_layer_width = '30px'
  const hamburger_hover_opacity = '1px'
  const hamburger_layer_height = '3px'
  // Ref : https://jonsuh.com/hamburgers/

  const hamburg_btn = css`
/*!
* Hamburgers
* @description Tasty CSS-animated hamburgers
* @author Jonathan Suh @jonsuh
* @site https://jonsuh.com/hamburgers
* @link https://github.com/jonsuh/hamburgers
*/
.hamburger {
 // padding: 15px 15px;
 display: inline-block;
 cursor: pointer;
 transition-property: opacity, filter;
 transition-duration: 0.15s;
 transition-timing-function: linear;
 font: inherit;
 color: inherit;
 text-transform: none;
 background-color: transparent;
 border: 0;
 margin: 5px 0 0;
 overflow: visible; }
 .hamburger:hover {
   opacity: ${hamburger_hover_opacity}; }
 .hamburger.is-active:hover {
   opacity: ${hamburger_hover_opacity}; }
 .hamburger.is-active .hamburger-inner,
 .hamburger.is-active .hamburger-inner::before,
 .hamburger.is-active .hamburger-inner::after {
   background-color: ${useColorModeValue('#fff', text_BW.d)}; }

.hamburger-box {
 width: ${hamburger_layer_width};
 height: 24px;
 display: inline-block;
 position: relative; }

.hamburger-inner {
 display: block;
 top: 50%;
 margin-top: -2px; }
 .hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
   width: ${hamburger_layer_width};
   height: ${hamburger_layer_height};
   background-color: ${useColorModeValue('#fff', text_BW.d)};
   border-radius: 4px;
   position: absolute;
   transition-property: transform;
   transition-duration: 0.15s;
   transition-timing-function: ease; }
 .hamburger-inner::before, .hamburger-inner::after {
   content: "";
   display: block; }
 .hamburger-inner::before {
   top: -10px; }
 .hamburger-inner::after {
   bottom: -10px; }

/*
  * Elastic
  */
.hamburger--elastic .hamburger-inner {
 top: 2px;
 transition-duration: 0.275s;
 transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); }
 .hamburger--elastic .hamburger-inner::before {
   top: 10px;
   transition: opacity 0.125s 0.275s ease; }
 .hamburger--elastic .hamburger-inner::after {
   top: 20px;
   transition: transform 0.275s cubic-bezier(0.68, -0.55, 0.265, 1.55); }

.hamburger--elastic.is-active .hamburger-inner {
 transform: translate3d(0, 10px, 0) rotate(135deg);
 transition-delay: 0.075s; }
 .hamburger--elastic.is-active .hamburger-inner::before {
   transition-delay: 0s;
   opacity: 0; }
 .hamburger--elastic.is-active .hamburger-inner::after {
   transform: translate3d(0, -20px, 0) rotate(-270deg);
   transition-delay: 0.075s; }

/*
  * Elastic Reverse
  */
.hamburger--elastic-r .hamburger-inner {
 top: 2px;
 transition-duration: 0.275s;
 transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); }
 .hamburger--elastic-r .hamburger-inner::before {
   top: 10px;
   transition: opacity 0.125s 0.275s ease; }
 .hamburger--elastic-r .hamburger-inner::after {
   top: 20px;
   transition: transform 0.275s cubic-bezier(0.68, -0.55, 0.265, 1.55); }

.hamburger--elastic-r.is-active .hamburger-inner {
 transform: translate3d(0, 10px, 0) rotate(-135deg);
 transition-delay: 0.075s; }
 .hamburger--elastic-r.is-active .hamburger-inner::before {
   transition-delay: 0s;
   opacity: 0; }
 .hamburger--elastic-r.is-active .hamburger-inner::after {
   transform: translate3d(0, -20px, 0) rotate(270deg);
   transition-delay: 0.075s; }
`
  return (
    <Center
      css={hamburg_btn}
      w={14}
      h={14}
      pos="fixed"
      borderRadius='full'
      bg={useColorModeValue(menuButton_bg_color.l, menuButton_bg_color.d)}
      bottom={btnPosition}
      left={!isArvhiveContent && btnPosition}
      right={isArvhiveContent && btnPosition}
      zIndex={2}
      onClick={onHandler}>
      <Box
        className={`hamburger hamburger--elastic ${isOpen && 'is-active'}`}
        type="button"
        p={0}
      >
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
      </Box>
    </Center>
  );
}

