import React, { Component } from 'react'
import { fetchUserDetails, getPostsForAUserWithPagination, getPostsForAUser } from '../actions';
import { connect } from 'react-redux';
import Pages from './Pages';
import InputForm from './InputForm';


class UserPost extends Component {
      //Initializing component state
    constructor(props) {
        super(props);
        this.state = {
            userID: null, 
            limit: 3,// maximum number of posts in a page
            pageOffset: 1, //currentPageNumber
            totalPostsByUser: 10,  //could be directly acheived from a API req and count length
            filterParams: '',//Filtering parameter for search box.
        }
    }
    componentDidMount() {
        this.setState({
            userID: this.props.match.params.id
        }) //setting userID state from url params
        this.props.fetchUserDetails(this.props.match.params.id) //action to fetch user details
        this.props.getPostsForAUserWithPagination(this.props.match.params.id, this.state.pageOffset, this.state.limit); //action to fetch posts of the user WITH pagination.
    }
   //Method upon clicking on any page number.
    updatePosts = (pageNo) => {
        this.setState({
            pageOffset: pageNo
        });
        this.props.getPostsForAUserWithPagination(this.props.match.params.id, pageNo, this.state.limit); 
    }
    //Method to filter post
    filterPosts = (keyword) => {
        //when filtering entire posts needs to be fetched and to be computed upon
        this.setState({
            filterParams: keyword
        });
        this.props.getPostsForAUser(this.state.userID); // fetching posts of that user
    }
    render() {
        //If any filter parameters provided then filter else directly render the paginaated posts.
        const posts = this.state.filterParams === '' ? this.props.paginatedPosts.map(post => {
            return <li className="posts-card"  onClick={()=>{this.props.history.push(`/post/${this.state.userID}/${post.id}`)}}  key={post.id + '-' + post.title}><div ><h4>{post.title}</h4></div></li>
        }) : this.props.posts.map(post => {
            if (post.title) {
                return post.title.includes(this.state.filterParams) ? <li className="posts-card" onClick={()=>{this.props.history.push(`/post/${this.state.userID}/${post.id}`)}}  key={post.id + '-' + post.title}><div ><h4>{post.title}</h4></div></li> : null
            }
        })
        return (<div>
            <div className="card card-body userCard">
                <div className="d-flex">
                    <div className="me-3 text-center pt-3">
                        <div><i className="fa fa-user userPhoto" aria-hidden="true"></i></div>
                    </div>
                    <div className="">
                        <div><h4 >{this.props.userDetail.name ? this.props.userDetail.name : null}</h4>  </div>

                        <div><p className="m-0">E-mail: {this.props.userDetail.email ? this.props.userDetail.email : null}</p></div>
                        <div><p className="m-0">Company: {this.props.userDetail.company ? this.props.userDetail.company.name : null}</p></div>
                    </div>
                </div>
            </div>
            <div className="card card-body postsOfuserCard">
                <div className="user-post-nav">
                    <div className="pt-2"><h6 style={{ marginLeft: '6px' }}>Blogs posted by {this.props.userDetail.name ? this.props.userDetail.name : null}</h6></div>
                  
                        <InputForm searchBy="Blog title" filter={this.filterPosts} />
                </div>
                <div>
                    <div className="posts">
                        <ul style={{ padding: '0px' }}>{posts.length > 0 ? posts.filter(Boolean).length > 0 ? posts : <div>No records found.</div> : <div className="loader"><h4><span className="donutSpinner me-2 "></span>Loading...</h4></div>}</ul>
                    </div>
                </div>
                <div>
                    {this.state.filterParams === '' && <Pages
                        totalPages={this.state.totalPostsByUser}
                        currentPage={this.state.pageOffset}
                        limit={this.state.limit}
                        updatePost={this.updatePosts} />}
                </div>
            </div>
        </div>
        )
    }
}
//Mapping state to props.
const mapStateToProps = (state) => {
    console.log(state.posts);
    return {
        userDetail: state.userDetail,
        paginatedPosts: state.paginatedPosts,
        posts: state.posts
    }
}
export default connect(mapStateToProps, {
    fetchUserDetails,
    getPostsForAUserWithPagination,
    getPostsForAUser
})(UserPost);
