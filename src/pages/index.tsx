import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Head from "next/head";
import techsImage from "../../public/images/techs.svg";
import { GetStaticProps } from "next";
import { getPrismicClient } from "@/services/prismic";
import Prismic  from "@prismicio/client";
import { RichText } from "prismic-dom"; 

type Content = {
    title: string;
    titleContent: string;
    linkAction: string;
    mobileTitle: string;
    mobileContent: string;
    mobileBanner: string;
    webTitle: string;
    webContent: string;
    webBanner: string;
}

interface ContentProps{
  content: Content
}

export default function Home({ content }: ContentProps) {
  return (
    <>
      <Head>
        <title>Apaixonado por tecnologia - Sujeito Programador</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <span>{content.titleContent}</span><br/>
            <a target="_blank" href={content.linkAction}>
              <button>
                COMEÇAR AGORA!
              </button>
            </a>
          </section>

          <img 
              src="/images/banner-conteudos.png"
              alt="Conteúdos Sujeito Programador"
            />

        </div>
        <hr className={styles.divisor}/>
        <div className={styles.sectionContent}>
          <section>
            <h2>{content.mobileTitle}</h2>
            <span>{content.mobileContent}</span>
          </section>

          <img 
            src={content.mobileBanner}
            alt="Conteúdo desenvolvimento de apps"
            />
        </div>
        <hr className={styles.divisor}/>
        <div className={styles.sectionContent}>
        <img 
            src={content.webBanner}
            alt="Conteúdo desenvolvimento de aplicações Web"
            />

          <section>
            <h2>{content.webTitle}</h2>
            <span>{content.webContent}</span>
          </section>
        </div>
        <hr className={styles.divisor}/>
        <div className={styles.nextLevelContent}>
          <Image quality={100} src={techsImage} alt="Tecnologias"/>
          <h2>Mais de <span className={styles.alunos}>15 mil</span> já levaram sua carreira ao próximo nivel.</h2>
          <span>E você vai perder a chance de evoluir de uma vez por todas?</span>
          <a target="_blank" href={content.linkAction}>
            <button>
              ACESSAR TURMA
            </button>
          </a>
        </div>


      </main>
    </>
  );
}


export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.Predicates.at("document.type", "home")
  ])

  //console.log(response.results[0].data);

  const {
    title, sub_title, link_action, 
    mobile, mobile_content, mobile_banner,
    title_web, web_content, web_banner
  } = response.results[0].data;

  const content = {
    title: RichText.asText(title),
    titleContent: RichText.asText(sub_title),
    linkAction: link_action.url,
    mobileTitle: RichText.asText(mobile),
    mobileContent: RichText.asText(mobile_content),
    mobileBanner: mobile_banner.url,
    webTitle: RichText.asText(title_web),
    webContent: RichText.asText(web_content),
    webBanner: web_banner.url 
  };

  return{
    props:{
      content
    },
    revalidate: 60 * 2 // a cada 2 minutos
  }
}