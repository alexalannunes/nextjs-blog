import Head from "next/head";
import React, { useReducer } from "react";
import Date from "../../components/date";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";

import utilStyles from "../../styles/utils.module.css";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {
  const [me, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "REQUEST":
          return {
            ...state,
            loading: true,
            data: null,
          };
        case "SUCESS": {
          return {
            ...state,
            loading: false,
            data: action.payload,
          };
        }
        default:
          return {
            ...state,
          };
      }
    },
    {
      data: null,
      loading: false,
    }
  );

  const click = React.useCallback(() => {
    dispatch({ type: "REQUEST" });
    fetch("https://api.github.com/users/alexalannunes")
      .then((e) => e.json())
      .then((e) => {
        dispatch({ type: "SUCESS", payload: e });
      });
  }, []);

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>

      <button onClick={click}>Request me {me?.data?.login}</button>
    </Layout>
  );
}
