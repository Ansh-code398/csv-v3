import '../css/style.css'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      const uid  = localStorage.getItem("user").toString();
      console.log(uid)
      axios.get(`https://csv-v3-api.vercel.app/api/users/${uid}`).then(res => {
        setUser(res.data);
        console.log(user)
      });
    }
    console.log(router.pathname)
  }, []);
  const router = useRouter();
  return (
    <>
      <Head>
        <title>CSV V3</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.0/css/all.min.css" crossorigin="anonymous"></link>
      </Head>

      {router.pathname !== "/story/[id]" || router.pathname !== "/" && <Navbar user={user} setUser={setUser}/>}
        <Component {...pageProps} user={user} setUser={setUser} />
      {/* <div className="grid wrapper">
      </div> */}
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></Script>
    </>
  )
}

export default MyApp
