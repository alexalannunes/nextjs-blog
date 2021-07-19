import Link from "next/link";
import Layout from "../../components/layout";

export async function getStaticProps({ params }) {
  const postData = await getGHinfo(params.username);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllNames();
  return {
    paths,
    fallback: false,
  };
}

export function getAllNames() {
  const usernames = ["alexalannunes", "arthurcvm", "BaseMax"];

  return usernames.map((username_) => {
    return {
      params: {
        username: username_,
      },
    };
  });
}

async function getGHinfo(username) {
  const fetched = await fetch(`https://api.github.com/users/${username}`);
  const data = await fetched.json();
  return data;
}

export default function Post({ postData }) {
  console.log(postData);
  return (
    <Layout>
      <h1>{postData.login}</h1>
      <img src={postData.avatar_url} style={{ width: 100, height: 100 }} />
      {getAllNames().map((i, x) => (
        <div key={x}>
          <Link href={`/me/${i.params.username}`}>{i.params.username}</Link>
        </div>
      ))}
    </Layout>
  );
}
