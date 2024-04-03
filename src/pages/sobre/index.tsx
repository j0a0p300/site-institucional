import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import styles from "./styles.module.scss";
import Head from "next/head";
import { GetStaticProps } from "next";
import Prismic from "@prismicio/client";
import { getPrismicClient } from "@/services/prismic";
import { RichText } from "prismic-dom";

type Content = {
    title: string;
    description: string;
    banner: string;
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
}

interface ContentProps{
    content: Content;
}

export default function Sobre({ content }: ContentProps){
    return(
        <>
           <Head>
                <title>Sobre | Sujeito Programador</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.sobre}>
                    <section className={styles.ctaText}>
                        <h1>{content.title}</h1>
                        <p>{content.description}</p>
                        <a href={content.youtube}>
                            <FaYoutube size={30} color="#fff"/>
                        </a>
                        <a href={content.instagram}>
                            <FaInstagram size={30} color="#fff"/>
                        </a>
                        <a href={content.facebook}>
                            <FaFacebookF size={30} color="#fff"/>
                        </a>
                        <a href={content.linkedin}>
                            <FaLinkedin size={30} color="#fff"/>
                        </a>
                    </section>

                    <img 
                        src={content.banner}
                        alt="Sobre"
                    />
                </div>
            </main> 
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.query([
        Prismic.Predicates.at("document.type", "about")
    ])
    
    const {
        title,
        description,
        banner,
        facebook,
        instagram,
        youtube,
        linkedin
    } = response.results[0].data;

    const content = {
        title: RichText.asText(title),
        description: RichText.asText(description),
        banner: banner.url,
        facebook: facebook.url,
        instagram: instagram.url,
        youtube: youtube.url,
        linkedin: linkedin.url
    };

    return{
        props:{
            content
        },
        revalidate: 60 * 15 // a cada 15 min
    }
}