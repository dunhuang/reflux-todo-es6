import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux'; 
//import ReactMixin from 'react-mixin';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory, hashHistory } from 'react-router';
import classNames from 'classnames';
import TodoActions from './todo.reflux.action.js';
import todoListStore from './todo.reflux.store.js';
import '../css/todo.reflux.component.css';

const HOME="/";

class TodoItem extends Component {
  //mixins: [React.addons.LinkedStateMixin], // exposes this.linkState used in render
  // getInitialState: function() {
  //     return {};
  // },
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleToggle(evt) {
    TodoActions.toggleItem(this.props.id);
  }
  handleEditStart(evt) {
    evt.preventDefault();
    // because of linkState call in render, field will get value from this.state.editValue
    this.setState({
        isEditing: true,
        editValue: this.props.label
    }, function() {
         ReactDOM.findDOMNode(this.refs.editInput).focus();
    });
  }
  handleValueOnChange(evt) {
    let text = ReactDOM.findDOMNode(this.refs.editInput).value; // because of the linkState call in render, this is the contents of the field
    this.setState({editValue:text });
  }
  handleValueChange(evt) {
    let text = this.state.editValue; // because of the linkState call in render, this is the contents of the field
    // we pressed enter, if text isn't empty we blur the field which will cause a save
    if (evt.which === 13 && text) {
         ReactDOM.findDOMNode(this.refs.editInput).blur();
    }
    // pressed escape. set editing to false before blurring so we won't save
    else if (evt.which === 27) {
        this.setState({ isEditing: false },function(){
             ReactDOM.findDOMNode(this.refs.editInput).blur();
        });
    }
  }
  handleBlur() {
    var text = this.state.editValue; // because of the linkState call in render, this is the contents of the field
    // unless we're not editing (escape was pressed) or text is empty, save!
    if (this.state.isEditing && text) {
        TodoActions.editItem(this.props.id, text);
    }
    // whatever the outcome, if we left the field we're not editing anymore
    this.setState({isEditing:false});
  }
  handleDestroy() {
    TodoActions.removeItem(this.props.id);
  }
  render() {  
    let classes = classNames({
        'completed': this.props.isComplete,
        'editing': this.state.isEditing
    });
    return (
      <li className={classes}>
        <div className="view">
            <input className="toggle" type="checkbox" checked={!!this.props.isComplete} onChange={this.handleToggle.bind(this)} />
            <label onDoubleClick={this.handleEditStart.bind(this)}>{this.props.label}</label>
            <button className="destroy" onClick={this.handleDestroy.bind(this)}></button>
        </div>
        <input ref="editInput" className="edit" value={this.state.editValue} onChange={this.handleValueOnChange.bind(this)} onKeyUp={this.handleValueChange.bind(this)} onBlur={this.handleBlur.bind(this)} />
      </li>
    );
  }
};
TodoItem.propTypes = {
  label: React.PropTypes.string.isRequired,
  isComplete: React.PropTypes.bool.isRequired,
  id: React.PropTypes.number
};
// Renders the todo list as well as the toggle all button
// Used in TodoApp
class TodoMain extends Component {
    //mixins: [ ReactRouter.State ],
    // propTypes: {
    //   //list: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    // },
  toggleAll(evt) {
    TodoActions.toggleAllItems(evt.target.checked);
  }
  render() {
    var filteredList;
    switch(this.props.location.pathname+this.props.location.search){
      case '/completed':
        filteredList = this.props.list.filter(function(item){ return item.isComplete; });
        break;
      case '/active':
        filteredList = this.props.list.filter(function(item){ return !item.isComplete; });
        break;
      default:
        filteredList = this.props.list;
    }
    var classes = classNames({
      "main":true, 
      "hidden": this.props.list.length < 1
    });
    return (
      <section id="main" className={classes}>
        <input id="toggle-all" className="toggle-all" type="checkbox" onChange={this.toggleAll.bind(this)} />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list" className="todo-list">
            { filteredList.map(function(item){
              return <TodoItem label={item.label} isComplete={item.isComplete} id={item.key} key={item.key}/>;
            })}
        </ul>
      </section>
    );
  }
};

// Renders the headline and the form for creating new todos.
// Used in TodoApp
// Observe that the toogleall button is NOT rendered here, but in TodoMain (it is then moved up to the header with CSS)
class TodoHeader extends Component {
  handleValueChange(evt) {
    let text = evt.target.value;
    if (evt.which === 13 && text) { // hit enter, create new item if field isn't empty
      TodoActions.addItem(text);
      evt.target.value = '';
    } else if (evt.which === 27) { // hit escape, clear without creating
      evt.target.value = '';
    }
  }
  render() {
    return (
      <header id="header">
        <h1>todos</h1>
        <input id="new-todo" className="new-todo" placeholder="What needs to be done?" autoFocus onKeyUp={this.handleValueChange.bind(this)}/>
      </header>
    );
  }
};

// Renders the bottom item count, navigation bar and clearallcompleted button
// Used in TodoApp
class TodoFooter extends Component {
  render() {
    let nbrcompleted = this.props.list.filter((item)=>item.isComplete).length,
        nbrtotal = this.props.list.length,
        nbrincomplete = nbrtotal-nbrcompleted,
        clearButtonClass = classNames({'clear-completed':true, hidden: nbrcompleted < 1}),
        footerClass = classNames({footer:true, hidden: !nbrtotal }),
        completedLabel = "Clear completed (" + nbrcompleted + ")",
        itemsLeftLabel = nbrincomplete === 1 ? " item left" : " items left";
    return (
      <footer id="footer" className={footerClass}>
        <p id="todo-count" className="todo-count"><strong>{nbrincomplete}</strong>{itemsLeftLabel}</p>
        <ul id="filters" className="filters">
          <li>
            <Link activeClassName="selected" to={HOME}>All</Link>
          </li>
          <li>
            <Link activeClassName="selected" to="/active">Active</Link>
          </li>
          <li>
            <Link activeClassName="selected" to="/completed">Completed</Link>
          </li>
        </ul>
        <button id="clear-completed" className={clearButtonClass} onClick={TodoActions.clearCompleted}>{completedLabel}</button>
        <div className="info">
          <p>Double-click to edit a todo</p>
          <p>Changed by <a href="http://github.com/dunhuang">Dunhuang</a></p>
          <p>Template by <a href="http://github.com/sindresorhus">Sindre Sorhus</a></p>
          <p>Created by <a href="https://github.com/spoike/refluxjs">Mikael Brassman</a></p>
          <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </div>
      </footer>
    );
  }
}
TodoFooter.propTypes={
  list: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

// Renders the full application
// RouteHandler will always be TodoMain, but with different 'showing' prop (all/completed/active)
class TodoApp extends Component {
  // this will cause setState({list:updatedlist}) whenever the store does trigger(updatedlist)
  constructor(props) {
    super(props);
    this.state = {
      list: todoListStore.getInitialState()
    };
  }
  componentDidMount() {
      this.unsubscribe = todoListStore.listen(this.onChange.bind(this));
  }
  componentWillUnmount() {
      this.unsubscribe(); // 注意：在组件销毁时，一定要解除监听
  }
  onChange(list) {
      this.setState({list:list}); // re-render
  }
  render() {
    return (
      <div>
        <TodoHeader />
        {React.cloneElement(this.props.children, {list: this.state.list })}
        <TodoFooter list={this.state.list} />
      </div>
    )
  }
};
//ReactMixin.onClass(TodoApp, Reflux.connect(todoListStore,"list"));

let routes = (
  <Router component={TodoApp}>
    <Route path={HOME} component={TodoMain} />
    <Route path="/completed" component={TodoMain} />
    <Route path="/active" component={TodoMain} />
  </Router>
);

ReactDOM.render(
  <Router history={browserHistory} routes={routes}/>, 
  document.getElementById('todoapp')
);
