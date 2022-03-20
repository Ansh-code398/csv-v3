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
            <img src={story.slides[0].bgLink} alt={story.name} className="text-center w-full"/>
          </div>
          <div>{story.name}</div>
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
