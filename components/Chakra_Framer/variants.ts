// Modal Nav links
export const nav_link_variants = {
    hidden: { opacity: 0, y: 10, },
    visible: {
        opacity: 1, y: 0,
        transition: {
            delay: 0.2,
        },
    },
}

// Hero
export const hero_video_variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 2 }
    }
}


export const hero_archive_link_variants = {
    hidden: { opacity: 0, y: 30, },
    visible: {
        opacity: 1, y: 0,
        transition: {
            delay: 0.3,
            type: "spring",
            damping: 22,
            stiffness: 400,
            duration: 2
        },
    },
}

const hero_icon_hidden = { x: 100 }
const hero_icon_visible = (delay = 0.6) => {
    return {
        x: 0,
        transition: {
            delay,
            type: "spring",
            damping: 30,
            stiffness: 400,
        },
    }
}

export const hero_icon_twitter_variants = {
    hidden: hero_icon_hidden,
    visible: hero_icon_visible(),
}

export const hero_icon_instagram_variants = {
    hidden: hero_icon_hidden,
    visible: hero_icon_visible(0.9),
}