import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import showdown from 'showdown';
import Markdown from 'markdown-to-jsx';
import { compiler } from 'markdown-to-jsx';
import StoryPreview from '../../../components/StoryPreview';
const Index = ({ story }) => {
  function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  function markdown_to_json(content) {
    let markdown_scenes = content.split("---");

    // console.log(markdown_scenes);

    var index = markdown_scenes.indexOf("");
    markdown_scenes = removeItemAll(markdown_scenes, "");
    let scenes = [];
    let markdown_scene_no = 0;
    for (markdown_scene_no in markdown_scenes) {
      let pattern = /\{\{.*?\}\}/gm;
      let results = markdown_scenes[markdown_scene_no].match(pattern);
      let MD_text = markdown_scenes[markdown_scene_no];
      let scene_json = {}
      let r_no = 0;
      for (r_no in results) {
        result = results[r_no].slice(2, -2);
        var index = result.indexOf(':');
        var result = [result.slice(0, index), result.slice(index + 1)];
        scene_json[result[0]] = result[1];
        MD_text = MD_text.replace(results[r_no], "");
      }
      
      scene_json["md_text"] = MD_text;
      scene_json["no"] = parseInt(markdown_scene_no) + 1;
      scenes.push(scene_json);
    }
    console.log(scenes)
    return scenes;
  }
  

  // useEffect(() => {
  //   // render_md_to_stage();
  // }, [current_scene])

  return (
    <div>
      <div id="previewer" className='w-screen mx-0' style={{ width: '100%' }} frameBorder={0}>
        {/* <div id="player_container" className="player_container w-full"> */}
          <StoryPreview scenes={markdown_to_json(story.description)} max_scene={markdown_to_json(story.description).length} />
        {/* </div> */}
      </div>
      {/* <div className="btn-group" role="group" aria-label="Basic example" style={{ display: 'flex', justifyContent: 'center' }}>
        <button id="prv_btn" type="button" className="btn btn-secondary" style={{ maxWidth: '50px' }} onClick={onPrvClick} ref={prv_btn}><i className="fa fa-step-backward text-black" aria-hidden="true" /></button>
        <button id="pause_btn" type="button" className="btn btn-secondary" style={{ maxWidth: '50px' }}></button>
        <button id="nxt_btn" type="button" className="btn btn-secondary text-black" style={{ maxWidth: '50px' }} onClick={OnNxtClick} ref={nxt_btn}><i className="fa fa-step-forward" aria-hidden="true" /></button>
      </div> */}
    </div>
  )
}

export default Index;

export async function getServerSideProps(ctx) {
  const data = await (await axios.get(`https://csv-v3-api.vercel.app/api/story/${ctx.query.id}`)).data;
  return {
    props: {
      // props to pass to the page component
      story: data.story,
    },
  }
}