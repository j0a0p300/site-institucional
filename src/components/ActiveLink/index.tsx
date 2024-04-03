import Link, {LinkProps} from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";


interface ActiveLinkProps extends LinkProps{
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({children, activeClassName, ...rest}: ActiveLinkProps){
    const {asPath} = useRouter();

    const className = asPath === rest.href ? activeClassName: '';
    //Se a rota/página que estamos acessando for igual ao link que o usuário clicou, ativamos o classname

    return(
        <Link {...rest}>
            {cloneElement(children, {className})}
        </Link>
    );
}