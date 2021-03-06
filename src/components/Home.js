import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchUsersWithBlogCount } from '../actions';

import InputForm from './InputForm';
import { Link } from 'react-router-dom';


class Home extends Component {
      //Initializing component state
    constructor() {
        super();
        this.state = {
            filterParam: 'Username', // maintaining a state for filter type USERNAME OR COMPANY
            filterKeyword: '', //Filtering parameter for filter box.
        }
    }
    
    componentDidMount() {
        this.props.fetchUsersWithBlogCount();
    }

    //Filter by type is it USERNAME (OR) COMPANY 
    onFilterApply = (data) => {
        this.setState({
            filterKeyword: data
        })
    }
//Updating filer parameters
    updateFilterParams = (params) => {
        this.setState({
            filterParam: params
        })
    }

    render() {
        // if no filter parameter  directly render list else  do filteration and then  render.
        const list = this.props.users.map((user, i) => {
            const num = this.props.posts.find(key => key.id === user.id ? key.num : 0)
            if (this.state.filterKeyword === '') {

            } else {
                if (this.state.filterParam === 'Username') {
                    if (!user.name.includes(this.state.filterKeyword)) // if the userName doesnot includes the filter keyword
                        return ;
                } else {
                    if (!user.company.name.includes(this.state.filterKeyword))// if the companyName doesnot includes the filter keyword
                        return ;
                }
            }
            return (<tr key={user.id}><td>{user.name}</td><td>{user.company.name}</td><td><Link className="link-parimary" to={`/posts/${user.id}`}> {
                num ? num.num : 0
            } blogs</Link></td></tr>)
        })
        return (
            <div>
                <InputForm filter={this.onFilterApply} searchBy={this.state.filterParam} updateSearchParams={this.updateFilterParams} />
                <table className="table">
                    <thead className="table-dark">
                        <tr >
                            <th scope="col">User Name</th>
                            <th scope="col">Company</th>
                            <th scope="col">Blogs</th>
                        </tr>   
                    </thead>
                    <tbody>
                        {
                           list.filter(Boolean).length > 0 ? list : <tr  key={list.length}><td colSpan="3">No records found.</td></tr>
                        }
                    </tbody>
                </table>
            </div>

        )
    }
}
// Mapping state to props
const mapStateToProps = (state) => {
    return { users: state.users, posts: state.posts }
}

export default connect(mapStateToProps, { fetchUsersWithBlogCount })(Home);
