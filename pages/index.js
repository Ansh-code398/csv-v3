import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material"
import axios from "axios"
import moment from "moment"

const Index = ({ stories }) => {
  console.log(stories)
  return (
    <>
      <div className="videos mx-auto justify-center mt-10">
        {stories && stories.map(({ story, createdAt }) => (
          <div className="video border-2 border-white">
          <div className="video-time">Created At - {moment(createdAt).format('MMM DD, YYYY')}</div>
          <div className="w-full overflow-hidden">
            <img src={story.slides[0].bgLink} alt={story.name} className="text-center w-full"/>
          </div>
          <div>{story.name}</div>
        </div>
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
