import React from 'react';
import { Container, TextField, CardMedia, TextareaAutosize, Box } from '@material-ui/core';
import axios from 'axios';
import close_button from './close.png';

class Mygiph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postcontent: '',
      giphname: '',
      search:'',
      gif_selection:'',
      gif_preview:false,
      gif_fetched_check:false,
      gifsearch:false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.GifFinder = this.GifFinder.bind(this);
    this.GifFavourite=this.GifFavourite.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.clearGif = this.clearGif.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount= async () =>{
    document.addEventListener('mousedown', this.handleClickOutside);
    console.log("exit")
}
clearGif =async () =>{
  this.setState({ gif_preview:false, gif_selection:''});
}
  GifFavourite= event =>{
    this.setState({gif_selection:event,gif_preview:true,gifsearch:false,gif_fetched_check:false})
    console.log("LOOK",event.target.currentSrc)
    console.log(this.state)
      };

  onFocus = event => {

    if(event.target.autocomplete)
    {
      event.target.autocomplete = "whatever";
    }
 
 };
 
setWrapperRef = (node) => {
  console.log("ZZZZZZZ")
  this.wrapperRef = node;
}

handleClickOutside(event) {
  if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
this.setState({gifsearch:false});
  }
}

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    let err = '';
    this.setState({[nam]: val});
  }
  myGifHandler =(event) => {
    this.setState({gifsearch:true});
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("qqqqqqqq")
    this.setState({ submitted: true });

      axios.post('http://127.0.0.1:8000/post',{ 
        post_content: this.state.postcontent?this.state.postcontent:null,
        giph_name: this.state.gif_selection?this.state.gif_selection.target.currentSrc:null,
    }
      ).then(res => { // then print response status
        console.log("Updated data successfully")
        console.log(res);
        alert("Successfully Updated")
        this.setState({
          postcontent:'', giphname:'',
        })
        window.location.reload();
 
        
    }).catch(res => {
        console.log("Updated data unsuccessfully")
        console.log(res)
        alert("Invalid Data Entered")
    })

}

GifFinder = async event => {
  this.state.search=event.target.value;
 
    const results = await axios("https://api.giphy.com/v1/gifs/search", {
      params: {
        api_key: "8XJzFLJyBWxvRSszRvQAkxN5dD78DuYG",
        q: this.state.search,
        limit: 10
      }
    });
    console.log("AAAAAAAAAAAAAAA")
    console.log(results)
    this.setState({gif_fetched:results.data.data,
      gif_fetched_check:true});

};


  render() {
    console.log("STATE")
    console.log(this.state)
    const GIFY=this.state.gif_fetched;
    return (
        <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      > 
        <Container maxWidth="sm" className="card_border">
        <Box>
      <form onSubmit={this.handleSubmit}>
           <Box mb={3}>
      <p></p>
      <TextareaAutosize

      style={{height:"140px", width:"28vw"}}
      className="area"
      variant="outlined"
        type='text'
        name='postcontent'
        label='Post Here'
        placeholder="Enter your text here..."
        autoComplete="off" onFocus={this.onFocus}
        onChange={this.myChangeHandler}
        
      />
          {this.state.gif_preview &&
          <>
       <img className="preview" src={this.state.gif_selection.target.currentSrc} />
       <img className="closebtn" src={close_button} onClick={this.clearGif}/>
       </>
      }
      <span >
        <a style={{position:'absolute'}} className="gifbutton" onClick={this.myGifHandler}>
        </a>
      </span>
       <br></br>
       {this.state.gifsearch &&
          <div className="card transition" ref={this.setWrapperRef}>
            <br></br>
      <TextField
        
        
        type='text'
        name='search'
        label='Search GIF'
        placeholder="Type here.."
        autoComplete="off"
        onChange={this.GifFinder}
        
      />
      {this.state.gif_fetched_check &&
      <div className="container gifs">
      {GIFY.map(e => {
          return (
            <div key={e.id} className="gif">
              <img src={e.images.fixed_width_small.url} onClick={(e) => this.GifFavourite(e)} />
              {console.log("HERE",e)}
            </div>
          );
        })
        }
      </div>
      }
      </div>
       }
          
        <Box my={2}>
        <button id="foot" className="button-os" type="submit"><a>POST</a>
        </button>
        </Box>
        <p></p>

      
      </Box>
      </form>
      </Box>
      </Container>
      </Box>
    );
  }
}

export default Mygiph;