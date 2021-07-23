import React, { Component } from "react";
import { Card, CardImg, CardImgOverlay, CardText, CardBody, CardTitle,
   Breadcrumb, BreadcrumbItem, Row, Col, Button, Modal, ModalHeader, ModalBody,
   Form, FormGroup, Input, Label } from "reactstrap";
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      rating: 1
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  handleSubmit(values) {
    this.props.addComment(this.props.dishId, values.rating, values.yourname, values.comment);
  }

  render() {
    return (
      <div className="row">
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
         <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
         <ModalBody>
           <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
             <Row className="form-group">
               <Label htmlFor="rating">Rating</Label>
               <Control.select model=".rating" id="rating" name="rating"
                      className="form-control">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
              </Control.select>
             </Row>

             <Row className="form-group">
               <Label htmlFor="yourname">Your Name</Label>
               <Control.text model=".yourname" id="yourname" name="yourname"
                placeholder="Your Name"
                className="form-control"
                validators={{
                  required, minLength: minLength(3), maxLength: maxLength(15)
                }} />
                <Errors
                    className="text-danger"
                    model=".yourname"
                    show="touched"
                    messages={{
                        required: 'Required.',
                        minLength: ' Must be greater than 2 characters',
                        maxLength: ' Must be 15 characters or less'
                    }}
                />
             </Row>

             <Row className="form-group">
               <Label htmlFor="comment">Comment</Label>
               <Control.textarea model=".comment" id="comment" name="comment"
                rows="6"
                className="form-control"/>
             </Row>

             <Button type="submit" value="submit" color="primary">Submit</Button>

           </LocalForm>
         </ModalBody>
        </Modal>
        <Button outline onClick={this.toggleModal} type="submit">
          <span className="fa fa-pencil fa-lg"></span> Submit Comment
        </Button>
      </div>
    );
  }

}

function RenderDish({dish}) {
    if (dish != null) {
        return (
            <div className='col-12 col-md-5 m-1'>
                <Card>
                    <CardImg width="100%" src={dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle> {dish.name}</CardTitle>
                        <CardText> {dish.description} </CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }
    else {
        return (
            <div></div>
        );
    }
}

function RenderComments({comments, addComment, dishId}){
    if (comments == null) {
        return (<div></div>)
    }
    const cmnts = comments.map(comment => {
        return (
            <li key={comment.id}>
                <p>{comment.comment}</p>
                <p>-- {comment.author},
                &nbsp;
                {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                </p>
            </li>
        )
    })
    return (
        <div className='col-12 col-md-5 m-1'>
          <div className="row">
            <h4> Comments </h4>
            <ul className='list-unstyled'>
                {cmnts}
            </ul>
          </div>
          <CommentForm dishId={dishId} addComment={addComment}/>
        </div>
    )
}


const DishDetail = (props) =>{

  if (props.isLoading) {
    return(
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  } else if (props.errMess) {
    return(
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  } else if (props.dish != null)  {
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col m-1">
            <RenderDish dish={props.dish} />
          </div>
          <div className="col m-1">
            <RenderComments comments={props.comments}
            addComment={props.addComment}
            dishId={props.dish.id} />
          </div>
        </div>
      </div>
    );
  } else {
    return (<div></div>);
  }
}

export default DishDetail;
