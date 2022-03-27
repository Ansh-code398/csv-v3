import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import showdown from 'showdown';
import Navbar from '../../../components/Navbar'

const Index = ({story}) => {
const prv_btn = useRef();
  const nxt_btn = useRef();

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
   let  scenes = [];
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
      document.getElementById('box_no' + scence["no"]).innerHTML += '<iframe id="iframe" height="100%" allowfullscreen width="100%" frameborder="0" src="' + v_link + '?autoplay=1&loop=1&mute=1&controls=0&disablekb&rel=0"></iframe>';
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
    let content = story.description
    let scences = markdown_to_json(content);
    JSON_to_stage(scences);
    //document.getElementById("player_container").innerHTML
  }

  // BUTTON CHANGE THE SLIDE
  var min_scene = 0;
  var current_scene = 1;
  var max_scene = 0;

   function onPrvClick () {
    current_scene -= 1;
    location.href = "#box_no" + (current_scene);
    if ((min_scene + 1) === current_scene) {
      prv_btn.current.classList.add("disabled");
      nxt_btn.current.classList.remove("disabled");
    }
    else {
      nxt_btn.current.classList.remove("disabled");
    }
  };
  function OnNxtClick () {
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
  
  return (
    <div>
      <Navbar/>
        <div id="previewer" className='w-screen mx-0' style={{width: '100%'}} frameBorder={0}>
          <div id="player_container" className="player_container w-full">
          </div>
        </div>
        <div className="btn-group" role="group" aria-label="Basic example" style={{ display: 'flex', justifyContent: 'center' }}>
        <button id="prv_btn" type="button" className="btn btn-secondary" style={{ maxWidth: '50px' }} onClick={onPrvClick} ref={prv_btn}><i className="fa fa-step-backward text-black" aria-hidden="true" /></button>
        <button id="pause_btn" type="button" className="btn btn-secondary" style={{ maxWidth: '50px' }}></button>
        <button id="nxt_btn" type="button" className="btn btn-secondary text-black" style={{ maxWidth: '50px' }} onClick={OnNxtClick} ref={nxt_btn}><i className="fa fa-step-forward" aria-hidden="true"  /></button>
      </div>
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