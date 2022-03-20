import { Button } from "@mui/material"
import axios from "axios"
import moment from "moment"
import Link from "next/link"

const Index = ({ stories }) => {
  console.log(stories)
  return (
    <>
      <div className="videos mx-auto justify-center mt-10">
        {stories && stories.map(({ story, createdAt, _id }) => (
          <Link href={`/story/${_id}`} key={_id}>
          <div className="video border-2 border-white" key={createdAt}>
          <div className="video-time">Created At - {moment(createdAt).format('MMM DD, YYYY')}</div>
          <div className="w-full overflow-hidden">
            <img src='https://static9.depositphotos.com/1559686/1203/i/600/depositphotos_12035522-stock-photo-open-book.jpg' alt={story.name} className="text-center w-full"/>
            <Button varient="contained">Go To Story</Button>
          </div>
          <div className="text-center">{story.name}</div>
        </div>
        </Link>
        ))}
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const data = await axios.get('https://csv-v3-api.vercel.app/api/story')
  const stories = data.data;
  return {
    props: {
      stories
    }
  }
}


export default Index
