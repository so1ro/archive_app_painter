import { Stack, Link } from '@chakra-ui/react';
import { nav_links } from '@/data/nav_links';
import ActiveLink from '@/components/ActiveLink';

export default function NavLinks() {
    return (
        <Stack spacing={4} isInline alignItems="center" d={{ base: "none", lg: "flex" }}>
            {nav_links.map(link => (
                <ActiveLink href={link.href} root={link.root} key={link.key}>
                    <Link>{link.text}</Link>
                </ActiveLink>
            ))}
        </Stack>
    );
}