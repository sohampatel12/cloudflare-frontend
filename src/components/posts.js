import React from "react";
import Post from './post';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert'

class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            id: 0,
            username: '',
            title: '',
            content: '',
            published_at: 0,
            errorMessage: '',
            showErrorMessage: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.loadPosts();
    }

    async loadPosts() {
        fetch("https://workers-api.sohampatel12.workers.dev/api/posts")
            .then(res => res.json())
            .then((result) => {
                console.log("Loading posts complete!");
                console.log(result);
                this.setState({ posts: result });
            })
    }

    handleChange(event) {
        let field = event.target.name;
        this.setState({
            [field]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ showErrorMessage: false });
        if (!this.state.username || !this.state.title || !this.state.content) {
            this.setState({ errorMessage: 'Please fill out all the details.', showErrorMessage: true });
            return;
        }
        let data = {
            id: new Date().getTime().toString(),
            username: this.state.username,
            title: this.state.title,
            content: this.state.content,
            published_at: new Date().getTime().toString()
        }
        fetch("https://workers-api.sohampatel12.workers.dev/api/post", {
            method: "POST",
            body: JSON.stringify(data),
        })
            .then((result) => {
                if (result.status == 200) {
                    this.setState({
                        posts: [...this.state.posts, data],
                        id: 0,
                        username: '',
                        title: '',
                        content: '',
                        published_at: 0,
                        errorMessage: '',
                        showErrorMessage: false
                    });
                } else {
                    this.handleError(result);
                }
            })
    }

    handleError(response) {
        this.setState({
            errorMessage: response,
            showErrorMessage: true
        });
    }

    render() {
        return (
            <Container className="center">
                <Row className="justify-content-md-center">
                    <div className="col-10">
                        <h1>Posts</h1>

                        {this.state.posts.map((post) => (
                            <Post post={post} key={post.id}></Post>
                        ))}

                        <br></br>
                        <h2>Create new post</h2>

                        <Alert show={this.state.showErrorMessage} variant="danger">{this.state.errorMessage}</Alert>

                        <Form>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>Username *</Form.Label>
                                <Form.Control name="username" type="text" required placeholder="Username" value={this.state.username} onChange={this.handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formTitle">
                                <Form.Label>Title *</Form.Label>
                                <Form.Control name="title" type="text" required placeholder="Title" value={this.state.title} onChange={this.handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formContent">
                                <Form.Label>Content *</Form.Label>
                                <Form.Control name="content" as="textarea" required placeholder="Content" value={this.state.content} onChange={this.handleChange} />
                            </Form.Group>

                            <Button variant="primary" type="submit" onClick={this.handleSubmit}>Create</Button>
                        </Form>
                    </div>
                </Row>
            </Container>
        );
    }
}

export default Posts;