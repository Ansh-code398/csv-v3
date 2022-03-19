import axios from "axios"
import { useEffect, useState } from "react"

const Index = () => {
    const [story, setStory] = useState(null)
  useEffect(() => {
    axios.get('/api/story').then(res => {
      console.log(res.data);
      setStory(res.data)
    }).catch(err => {
      console.log(err);
    })
  }, [])
  return (
    <>
      Nothing here lol
    </>
  )
}



export default Index
