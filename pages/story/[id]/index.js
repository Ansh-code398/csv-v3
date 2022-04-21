import { Button, Collapse, IconButton } from '@mui/material';
import axios from 'axios';
import React, { useState, useRef } from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import StoryPreview from '../../../components/StoryPreview';
const Index = ({ story, user, storyId }) => {
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

  const [edit, setEdit] = React.useState(false);

  const [editor, setEditor] = useState("");

  const [n, setN] = useState(story.name);

  const name = useRef()

  function onDownload() {
    var blob = new Blob([editor], { type: "text/plain;charset=utf-8" });
    saveAs(blob, n + ".csvs");
  }
  function saveAs(blob, fileName) {
    var url = window.URL.createObjectURL(blob);
    var anchorElem = document.createElement("a");
    anchorElem.href = url;
    anchorElem.download = fileName;
    anchorElem.click();
    window.URL.revokeObjectURL(url);
  }


  function markdown_to_json(content) {
    let markdown_scenes = content.split("---");

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
    return scenes;
  }
  React.useEffect(() => {
    setEditor(story.description);
  }, []);


  return (
    <>
      <div id="previewer" className='w-screen mx-0 mb-10' style={{ width: '100%' }} frameBorder={0}>
        <StoryPreview scenes={markdown_to_json(story.description)} max_scene={markdown_to_json(story.description).length} user={user} storyUserId={story.userId} setEdit={setEdit} edit={edit} showIcons={true} />
      </div>
      <Collapse in={edit}>
        <div className="contained align-text-center mt-10">
          <div className="align-text-center mt-5 mb-3">
            <label htmlFor="exampleFormControlInput1" className="align-text-center form-label" ref={name} required>Document Name</label>
            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Billinger.md" value={n} onChange={(e) => {
              setN(e.target.value)
            }} />
          </div>
          <div className="editor d-flex">
            <textarea placeholder="Enter markdown..." id="markdown_editor" value={editor} onChange={(e) => {
              setEditor(e.target.value);
            }} className="markdown_editor" oninput="render_md_to_stage();" defaultValue={"---\n{{time:1000}}\n{{animate: true}}\n{{bg_typ:img}}\n{{bg_link:https://wallpaperaccess.com/full/3214373.jpg}}\n{{class:d-flex flex-column min-vh-100 justify-content-center align-items-center}}\n# Slide 1\n## Scenes\n---\n{{time:1000}}\n{{class:d-flex flex-column min-vh-100 justify-content-center align-items-center}}\n# Slide 2\n---\n{{time:1000}}\n{{bg_typ:ytv}}\n{{bg_link:https://www.youtube.com/embed/jV3xxOoWe-4}}\n{{class:d-flex flex-column min-vh-100 justify-content-center align-items-center}}\n# Slide 3\n\t\t\t"} />
            <div id="previewer" frameBorder={0}>
              <StoryPreview scenes={markdown_to_json(editor)} max_scene={markdown_to_json(editor).length} />
            </div>
          </div>
          <div className="btn-group" role="group" style={{ display: 'flex', justifyContent: 'center' }}>
            {n && <IconButton style={{ maxWidth: '50px' }} color="inherit" onClick={onDownload}>
              <DownloadIcon />
            </IconButton>
            }
          </div>
          <div className='w-full flex justify-center items-center mx-0'>
            <Button varient="success" disabled={n.split(" ").join("") === ""} onClick={() => {
              axios.put(`https://csv-v3-api.vercel.app/api/story/${storyId}`, {
                userId: user._id,
                story: {
                  name: n,
                  description: editor,
                  userId: user._id,
                }
              }).then(res => {
                window.location.reload();
              }).catch(err => {
                console.log(err);
              })
            }}>
              Submit
            </Button>
          </div>
        </div>
      </Collapse>
    </>
  )
}

export default Index;

export async function getServerSideProps(ctx) {
  const data = await (await axios.get(`https://csv-v3-api.vercel.app/api/story/${ctx.query.id}`)).data;
  if(!data){
    return {
      props: {
        story: {
          name: "404 Not Found",
          description: "---\n{{time:1000}}\n{{animate: true}}\n{{bg_typ:img}}\{{bg_link:https://www.online-tech-tips.com/wp-content/uploads/2022/03/image-41.jpeg}}\n{{class:d-flex flex-column min-vh-100 justify-content-center align-items-center text-black cursor-pointer transition-all duration-1000 hover:bg-white}}\n# Are You Lost?\n[Go Home](/)"
        }
    }
  }
}
  return {
    props: {
      storyId: ctx.query.id,
      story: data.story,
    },
  }
}