import { GetServerSideProps } from "next";
import styles from "./post.module.scss";

import { ParsedUrlQuery } from "querystring";
import { getPrismicClient } from "@/services/prismic";
import Prismc from "@prismicio/client"
import { RichText } from "prismic-dom";
import Head from "next/head";
import Image from "next/image";

interface Params extends ParsedUrlQuery {
    slug: string;
  }

interface PostProps{
    post:{
        slug: string;
        title: string;
        cover: string;
        description: string;
        updatedAt: string;
    }
}


export default function Post({ post }: PostProps){
    return(
        <>
            <Head>
                <title>{post.title}</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <Image
                        quality={100}
                        src={post.cover}
                        width={720}
                        height={410}
                        alt={post.title}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNUVVevBwAB4AD0DQwGjAAAAABJRU5ErkJggg=="
                    />

                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.description}}>

                    </div>
                </article>
            </main>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
    const { slug } = params as Params;
    const prismic = getPrismicClient(req);

    const response = await prismic.getByUID("post", String(slug), {})

    if(!response){
        return{
            redirect:{
                destination: "/posts",
                permanent: false
            }
        }
    }

    const post = {
        slug: slug,
        title: RichText.asText(response.data.title),
        description: RichText.asHtml(response.data.description),
        cover: response.data.cover.url,
        updatedAt: new Date(String(response.last_publication_date)).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    }

    return {
        props:{
            post
        }
    }
}