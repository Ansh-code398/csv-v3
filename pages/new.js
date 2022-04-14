import { useEffect, useRef, useState } from 'react';
// import Form from '../components/Form'
import showdown from 'showdown';
import { Button, Icon, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';

const NewPet = ({ user, setUser }) => {
  //Markdown to Json converter
  const prv_btn = useRef();
  const nxt_btn = useRef();
  const [editor, setEditor] = useState("---\n{{time:100}}\n{{bg_typ:img}}\n{{bg_link:https://picsum.photos/1000/1000}}\n{{class:d-flex flex-column min-vh-100 justify-content-center align-items-center}}\n# Slide 1\n## Scenes\n---\n{{time:100}}\n{{class:d-flex flex-column min-vh-100 justify-content-center align-items-center}}\n# Slide 2\n---\n{{time:100}}\n{{bg_typ:ytv}}\n{{bg_link:https://www.youtube.com/embed/jV3xxOoWe-4}}\n{{class:d-flex flex-column min-vh-100 justify-content-center align-items-center}}\n# Slide 3\n\t\t\t");

  const [n, setN] = useState("Test");

  const name = useRef()

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
    return scenes;
  }

  function JSON_to_stage(scences) {
    // Slide = Scence
    // render_music();
    let scence = 0;
    for (scence of scences) {
      let nxt_time = scence["nxt"];
      render_scence(scence);
    }
    max_scene = scences.length;
  }

  function set_background(scence) {
    if (scence["bg_typ"] == "img") {
      document.getElementById("box_no" + scence["no"]).style.backgroundImage = "url(" + scence["bg_link"] + ")";
      document.getElementById("box_no" + scence["no"]).classList.add("bg_img");
    }
    else if (scence["bg_typ"] == "ytv") {
      var v_link = scence["bg_link"];
      //document.getElementById("player_container").style.display = "none"
      console.log(v_link)
      // document.getElementById('box_no' + scence["no"]).innerHTML += '<iframe id="iframe" height="100%" allowfullscreen width="100%" frameborder="0" src="' + v_link + '?autoplay=1&loop=1&mute=1&controls=0&disablekb&rel=0"></iframe>';
      document.getElementById('box_no' + scence["no"]).innerHTML += `<video width="560" height="315" class="absolute top-0 left-0 w-full h-full" src="${v_link}" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></video>`;
      console.log(v_link);//document.getElementById("iframe").setAttribute("src",v_link+'?autoplay=1&loop=1&mute=1&controls=0&disablekb&rel=0');
    }
  }

  function set_text(scence) {
    var converter = new showdown.Converter();
    var html_rendering = converter.makeHtml(scence["md_text"]);
    console.log(scence);
    document.getElementById("box_no" + scence["no"]).innerHTML = "<div class='" + scence["class"] + "'>" + html_rendering + "</div>";
  }

  function render_scence(scence) {
    document.getElementById("player_container").innerHTML += "<div id='box_no" + scence["no"] + "' class='scence_box'></div>";
    set_background(scence);
    set_text(scence);
  }

  // Render MD to stage
  function clear_stage() {
    document.getElementById("player_container").innerHTML = "";
  }
  function render_md_to_stage() {
    clear_stage();
    let content = editor
    let scences = markdown_to_json(content);
    JSON_to_stage(scences);
    //document.getElementById("player_container").innerHTML
  }

  // BUTTON CHANGE THE SLIDE
  var min_scene = 0;
  var current_scene = 1;
  var max_scene = 0;

  function onPrvClick() {
    current_scene -= 1;
    location.href = "#box_no" + (current_scene);
    if (min_scene + 1 == current_scene) {
      prv_btn.current.classList.add("disabled");
      nxt_btn.current.classList.remove("disabled");
    }
    else {
      nxt_btn.current.classList.remove("disabled");
    }
  };
  function OnNxtClick() {
    current_scene += 1;
    location.href = "#box_no" + (current_scene);
    if (max_scene == current_scene) {
      nxt_btn.current.classList.add("disabled");
      prv_btn.current.classList.remove("disabled");
    }
    else {
      prv_btn.current.classList.remove("disabled");
    }
  }
  //code next to it is to start showing pic even if user didn't give input
  useEffect(() => {
    render_md_to_stage();
  }, [])

  useEffect(() => {
    render_md_to_stage();
  }, [editor])

  return (
    <>
      <Navbar user={user} setUser={setUser}/>
      <div className="contained align-text-center">
        <div className="align-text-center mt-5 mb-3">
          <label htmlFor="exampleFormControlInput1" className="align-text-center form-label" ref={name} required>Document Name</label>
          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Billinger.md" value={n} onChange={(e) => {
            setN(e.target.value)
          }} />
        </div>
        <div className="editor d-flex">
          <textarea placeholder="Enter markdown..." id="markdown_editor" value={editor} onChange={(e) => {
            setEditor(e.target.value);
          }} className="markdown_editor" oninput="render_md_to_stage();" defaultValue={"---\n{{time:100}}\n{{bg_typ:img}}\n{{bg_link:https://picsum.photos/1000/1000}}\n{{class:d-flex flex-column min-vh-100 justify-content-center align-items-center}}\n# Slide 1\n## Scenes\n---\n{{time:100}}\n{{class:d-flex flex-column min-vh-100 justify-content-center align-items-center}}\n# Slide 2\n---\n{{time:100}}\n{{bg_typ:ytv}}\n{{bg_link:https://www.youtube.com/embed/jV3xxOoWe-4}}\n{{class:d-flex flex-column min-vh-100 justify-content-center align-items-center}}\n# Slide 3\n\t\t\t"} />
          <div id="previewer" frameBorder={0}>
            <div id="player_container" className="player_container">
            </div>
          </div>
        </div>
        <div className="btn-group" role="group" style={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton style={{ maxWidth: '50px' }} color="inherit" onClick={onPrvClick} ref={prv_btn}>
            <SkipPreviousIcon />
          </IconButton>
          {n && <IconButton style={{ maxWidth: '50px' }} color="inherit" onClick={onDownload}>
            <DownloadIcon />
          </IconButton>
          }
          <IconButton style={{ maxWidth: '50px' }} color="inherit" onClick={OnNxtClick} ref={nxt_btn}>
            <SkipNextIcon />
          </IconButton>
        </div>
        <div className='w-full flex justify-center items-center mx-0'>
          <Button varient="success" disabled={n.split(" ").join("") === ""} onClick={() => {
            axios.post('https://csv-v3-api.vercel.app/api/story/', {
              story: {
                name: n,
                description: editor
              }
            }).then(res => {
              window.location.href = `/story/${res.data._id}`
            })
          }}>
            Submit
          </Button>
        </div>

      </div>
    </>
  )
}

export default NewPet
