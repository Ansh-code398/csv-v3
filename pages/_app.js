import '../css/style.css'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Script from 'next/script'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>CSV V3</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.0/css/all.min.css" crossorigin="anonymous"></link>
      </Head>

      <Navbar />
        <Component {...pageProps} />
      {/* <div className="grid wrapper">
      </div> */}
      <Script src="https://cdn.jsdelivr.net/npm/showdown@2.0.0/dist/showdown.min.js"></Script>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></Script>
    </>
  )
}

export default MyApp
