import React, { Component, useState } from 'react';
import Cookies from 'universal-cookie';
import {
  Alert,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonToolbar,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Container,
  FormGroup,
  FormText,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Row,
  Popover,
  PopoverBody
} from 'reactstrap';
import {Link} from 'react-router-dom';
import ArgoLogo from './argologo_color.svg';
import ArgoLogoAnim from './argologo_anim.svg';
import EULogo from './eu.png';
import EOSCLogo from './eosc.png';
import './UIElements.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faBox,
  faBoxOpen,
  faCrosshairs,
  faCog,
  faCogs,
  faExclamation,
  faFileAlt,
  faGavel,
  faHandshake,
  faHighlighter,
  faIdBadge,
  faKey,
  faLink,
  faSearch,
  faServer,
  faSignOutAlt,
  faSquare,
  faTable,
  faTasks,
  faUser,
  faWrench}
from '@fortawesome/free-solid-svg-icons';
import { NotificationManager } from 'react-notifications';
import { Field } from 'formik';
import { Backend } from './DataManager';
import ReactDiffViewer from 'react-diff-viewer';
import Autosuggest from 'react-autosuggest';


var list_pages = ['administration', 'probes',
                  'metrics', 'metricprofiles', 'aggregationprofiles',
                  'thresholdsprofiles', 'operationsprofiles'];
var admin_list_pages = ['administration', 'tenants', 'yumrepos', 'packages',
                        'probes', 'metrictemplates'];

var link_title = new Map();
link_title.set('administration', 'Administration');
link_title.set('reports', 'Reports');
link_title.set('probes', 'Probes');
link_title.set('public_probes', 'Public probes');
link_title.set('public_metrictemplates', 'Public metric templates');
link_title.set('metrics', 'Metrics');
link_title.set('public_metrics', 'Public metrics');
link_title.set('metricprofiles', 'Metric profiles');
link_title.set('public_metricprofiles', 'Metric profiles');
link_title.set('public_aggregationprofiles', 'Aggregation profiles');
link_title.set('aggregationprofiles', 'Aggregation profiles');
link_title.set('groupofaggregations', 'Groups of aggregations');
link_title.set('groupofmetrics', 'Groups of metrics');
link_title.set('groupofmetricprofiles', 'Groups of metric profiles');
link_title.set('users', 'Users');
link_title.set('apikey', 'API key');
link_title.set('metrictemplates', 'Metric templates');
link_title.set('yumrepos', 'YUM repos');
link_title.set('groupofthresholdsprofiles', 'Groups of thresholds profiles');
link_title.set('public_thresholdsprofiles', 'Thresholds profiles');
link_title.set('thresholdsprofiles', 'Thresholds profiles');
link_title.set('packages', 'Packages');
link_title.set('tenants', 'Tenants');
link_title.set('operationsprofiles', 'Operations profiles');
link_title.set('public_operationsprofiles', 'Operations profiles');
link_title.set('policies', 'Privacy policies');


export const Icon = props =>
{
  let link_icon = new Map();
  link_icon.set('administration', faWrench);
  link_icon.set('serviceflavour', faHighlighter);
  link_icon.set('reports', faFileAlt);
  link_icon.set('probes', faServer);
  link_icon.set('metrics', faCog);
  link_icon.set('metrictemplates', faCog);
  link_icon.set('metricprofiles', faCogs);
  link_icon.set('aggregationprofiles', faTasks);
  link_icon.set('apikey', faKey);
  link_icon.set('yumrepos', faBoxOpen);
  link_icon.set('thresholdsprofiles', faExclamation);
  link_icon.set('users', faUser);
  link_icon.set('packages', faBox);
  link_icon.set('tenants', faIdBadge);
  link_icon.set('operationsprofiles', faTable);
  link_icon.set('policies', faGavel);
  link_icon.set('terms', faHandshake);
  link_icon.set('argodoc', faLink);
  link_icon.set('documentation', faBook);

  if (props.i.startsWith('groupof'))
    return (
      <span className='fa-layers fa-fw'>
        <FontAwesomeIcon icon={faSquare} color='white' fixedWidth/>
        <FontAwesomeIcon icon={link_icon.get(props.i.replace('groupof', ''))} transform={`shrink-${props.i === 'groupofmetricprofiles' ? 9 : 8} up-3`}/>
        <FontAwesomeIcon icon={link_icon.get(props.i.replace('groupof', ''))} transform={`shrink-${props.i === 'groupofmetricprofiles' ? 9 : 8} down-4.2 left-5`}/>
        <FontAwesomeIcon icon={link_icon.get(props.i.replace('groupof', ''))} transform={`shrink-${props.i === 'groupofmetricprofiles' ? 9 : 8} down-4.2 right-5`}/>
      </span>
    )
  else
    return <FontAwesomeIcon icon={link_icon.get(props.i)} size={props.i === 'yumrepos' || props.i === 'metricprofiles' ? 'sm' : '1x'} fixedWidth/>
}


export const DropDown = ({field, data=[], prefix="", class_name="", isnew=false, errors=undefined}) =>
  <Field component="select"
    name={prefix ? `${prefix}.${field.name}` : field.name}
    required={true}
    className={`form-control ${class_name} ${isnew ? 'border-success' : `${errors && errors[field.name] ? 'border-danger' : ''}`}`}
  >
    {
      data.map((name, i) => (
        i === 0 ?
          <option key={i} value='' hidden color='text-muted'>{name}</option>
        :
          <option key={i} value={name}>{name}</option>
      ))
    }
  </Field>


export const SearchField = ({form, field, ...rest}) =>
  <div className="input-group">
    <input type="text" placeholder="Search" {...field} {...rest}/>
    <div className="input-group-append">
      <span className="input-group-text" id="basic-addon">
        <FontAwesomeIcon icon={faSearch}/>
      </span>
    </div>
  </div>


const doLogout = async (history, onLogout) =>
{
  let cookies = new Cookies();

  onLogout();

  let response = await fetch('/rest-auth/logout/', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': cookies.get('csrftoken'),
      'Referer': 'same-origin'
    }});
    if (response.ok)
      history.push('/ui/login');
}


export const ModalAreYouSure = ({isOpen, toggle, title, msg, onYes}) =>
(
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>{title}</ModalHeader>
    <ModalBody>
      {msg}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={() => {
        onYes();
        toggle();
      }}>Yes</Button>{' '}
      <Button color="secondary" onClick={toggle}>No</Button>
    </ModalFooter>
  </Modal>
)


export const CustomBreadcrumb = ({location, history, publicView=false}) =>
{
  let spliturl = new Array()
  let breadcrumb_elements = new Array()
  let two_level = new Object()

  breadcrumb_elements.push({'url': `/ui/${publicView ? 'public_' : ''}home`, 'title': 'Home'});
  if (!publicView)
    spliturl = location.pathname.split('/');

  else
    spliturl = window.location.pathname.split('/');

  two_level['url'] = '/ui/' + spliturl[2];
  two_level['title'] = link_title.get(spliturl[2]);
  breadcrumb_elements.push(two_level);

  if (spliturl.length > 3) {
    var three_level = new Object({'url': two_level['url'] + '/' + spliturl[3]});
    three_level['title'] = two_level['title'] === 'Administration' ? link_title.get(spliturl[3]) : spliturl[3];
    breadcrumb_elements.push(three_level)
  }

  if (spliturl.length > 4) {
    var four_level = new Object({'url': three_level['url'] + '/' + spliturl[4]});
    four_level['title'] = spliturl[4];
    breadcrumb_elements.push(four_level)
  }

  if (spliturl.length > 5) {
    var five_level = new Object({'url': four_level['url'] + '/' + spliturl[5]});
    five_level['title'] = spliturl[5];
    breadcrumb_elements.push(five_level);
  }

  if (spliturl.length > 6 && five_level['title'] === 'history') {
    var six_level = new Object({'url': five_level['url'] + '/' + spliturl[6]});
    six_level['title'] = spliturl[6];
    breadcrumb_elements.push(six_level);
  }

  return (
    <Breadcrumb id='argo-breadcrumb' className="border-top rounded">
      {
        breadcrumb_elements.map((item, i) =>
          i !== breadcrumb_elements.length - 1
          ?
            <BreadcrumbItem key={i}>
              <Link to={item['url']}>{item['title']}</Link>
            </BreadcrumbItem>
          :
            <BreadcrumbItem key={i} active>
              {item['title']}
            </BreadcrumbItem>
        )
      }
    </Breadcrumb>
  );
}


const UserDetailsToolTip = ({userDetails, isTenantSchema, publicView}) =>
{
  const NoPermBadge = ({only=false}) =>
    only ?
      <div className="text-center">
         <Badge color="dark" className="mb-1 mt-1" style={{fontSize: '100%'}}>
          No permissions
        </Badge>
      </div>
    :
      <Badge color="dark" className="mb-1 mt-1">
        No permissions
      </Badge>

  const GroupBadge = ({name}) =>
    <span>
      <Badge color="primary" className="mb-1 mt-1">
        {name}
      </Badge>{' '}
    </span>

  const WhiteRuler = () =>
    <div>
      <hr style={{'borderTop': '1px solid black'}}/>
    </div>

  const HaveAnyPerm = (groups) => {
    let havePerm = false

    for (var group in groups) {
      if (groups[group].length > 0) {
        havePerm = true
        break
      }
    }
    return havePerm
  }


  return (
    publicView ?
      <div>
        <div>
          <Badge color="warning" style={{fontSize: "100%"}} pill>
            Anonymous User
          </Badge>
        </div>
        <WhiteRuler/>
        <NoPermBadge only={true}/>
      </div>
    :
      <div>
        <div className="text-center">
          {
            userDetails.is_superuser ?
              <Badge color="danger" className="mt-2 mb-2" style={{fontSize: "100%"}} pill>
                {
                  isTenantSchema
                    ? 'Tenant Admin'
                    : 'Super Admin'
                }
              </Badge>
              :
              <Badge color="success" className="mt-2 mb-2" style={{fontSize: "100%"}} pill>
                Tenant User
              </Badge>
          }
        </div>
        {
          userDetails.first_name &&
          <div className="text-center">
            <b>{userDetails.first_name}{' '}{userDetails.last_name}</b>
          </div>
        }
        {
          <div className="text-center text-primary">
            {
              !userDetails.first_name ?
                <br/>
              :
                null
            }
            {userDetails.email}
          </div>
        }
        {
          userDetails.is_superuser ?
            null
          :
            HaveAnyPerm(userDetails.groups) ?
              <div>
                <WhiteRuler/>
                <div className="text-left">
                  Aggregation profiles:
                  <br/>
                  {
                    userDetails.groups.aggregations.length > 0
                      ?
                        userDetails.groups.aggregations.map((group, index) => (
                          <GroupBadge name={group} key={index}/>
                        ))
                      :
                        <NoPermBadge/>
                  }
                </div>
                <div className="text-left">
                  Metrics:
                  <br/>
                  {
                    userDetails.groups.metrics.length > 0
                      ?
                        userDetails.groups.metrics.map((group, index) => (
                          <GroupBadge name={group} key={index}/>
                        ))
                      :
                        <NoPermBadge/>
                  }
                </div>
                <div className="text-left">
                  Metric profiles:
                  <br/>
                  {
                    userDetails.groups.metricprofiles.length > 0
                      ?
                        userDetails.groups.metricprofiles.map((group, index) => (
                          <GroupBadge name={group} key={index}/>
                        ))
                      :
                        <NoPermBadge/>
                  }
                </div>
                <div className="text-left">
                  Thresholds profiles:
                  <br/>
                  {
                    userDetails.groups.thresholdsprofiles.length > 0
                      ?
                        userDetails.groups.thresholdsprofiles.map((group, index) => (
                          <GroupBadge name={group} key={index}/>
                        ))
                      :
                        <NoPermBadge/>
                  }
                </div>
              </div>
            :
              <div>
                <WhiteRuler/>
                <NoPermBadge only={true}/>
              </div>
        }
      </div>
  )
}


export const NavigationBar = ({history, onLogout, isOpenModal, toggle,
  titleModal, msgModal, userDetails, isTenantSchema, publicView}) =>
{
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <React.Fragment>
      <ModalAreYouSure
        isOpen={isOpenModal}
        toggle={toggle}
        title={titleModal}
        msg={msgModal}
        onYes={() => doLogout(history, onLogout)} />
      <Navbar expand="md" id="argo-nav" className="border rounded">
        <NavbarBrand className="text-light">
          <img src={ArgoLogo} alt="ARGO logo" className="img-responsive"/>
          <span className="pl-3">
            <strong>ARGO</strong> POEM
          </span>
        </NavbarBrand>
        <NavbarToggler/>
        <Collapse navbar className='justify-content-end'>
          <Nav navbar >
            <NavItem className='m-2 ml-5 text-light'>
              Welcome,&nbsp;
              <span onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                className='font-weight-bold' href="#" id="userToolTip">
                <Badge href="#" color="dark" style={{fontSize: '100%'}}>
                  {userDetails.first_name ? userDetails.first_name : userDetails.username}
                </Badge>
              </span>
              <Popover style={{opacity: 0.9}} placement="bottom" isOpen={tooltipOpen}
                target="userToolTip" toggle={() => setTooltipOpen(!tooltipOpen)}>
                <PopoverBody>
                  <UserDetailsToolTip userDetails={userDetails} isTenantSchema={isTenantSchema} publicView={publicView}/>
                </PopoverBody>
              </Popover>
            </NavItem>
            <NavItem className='m-2'>
              <Button
                id="argo-navbar-logout"
                size="sm"
                onClick={() => toggle()}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </React.Fragment>
  )
}


export const NavigationLinks = ({location, isTenantSchema, userDetails}) => {
  var data = undefined;

  !isTenantSchema ? data = admin_list_pages : data = list_pages
  if (!userDetails.is_superuser)
    data = data.filter(e => e !== 'administration')

  return (
    <Nav vertical pills id="argo-navlinks" className="border-left border-right border-top rounded-top sticky-top">
      {
        data.map((item, i) =>
          <NavItem key={i}>
            <NavLink
              tag={Link}
              active={location.pathname.split('/')[2] === item ? true : false}
              className={location.pathname.split('/')[2] === item ? "text-white bg-info" : "text-dark"}
              to={'/ui/' + item}><Icon i={item}/> {link_title.get(item)}
            </NavLink>
          </NavItem>
        )
      }
    </Nav>
    )
}


export const NavigationAbout = ({ location, poemVersion }) => {
  return (
    <React.Fragment>
      <div className="bg-white border-left border-right pl-2 mt-0 pt-5 text-uppercase">
        <h5>Info</h5>
      </div>
      <Nav vertical pills id="argo-navlinks" className="border-left border-right sticky-top rounded-bottom border-bottom pb-2 mb-0">
        <NavLink
          tag="a"
          href='http://argoeu.github.io/poem/v1/'
          className="text-dark"
          target="_blank" rel="noopener noreferrer"
        >
          <Icon i="documentation"/>{' '}
          Documentation
        </NavLink>
        <NavLink
          tag="a"
          href='http://argoeu.github.io/overview'
          className="text-dark"
          target="_blank" rel="noopener noreferrer"
        >
          <Icon i="argodoc"/>{' '}
          About ARGO
        </NavLink>
        <NavLink
          tag="a"
          href='https://ui.argo.grnet.gr/egi/termsofUse'
          className="text-dark"
          target="_blank" rel="noopener noreferrer"
        >
          <Icon i="terms"/>{' '}
          Terms
        </NavLink>
        <NavLink
          tag={Link}
          active={location.pathname.split('/')[2] === 'policies' ? true : false}
          className={location.pathname.split('/')[2] === 'policies' ? "text-white bg-info" : "text-dark"}
          to="/ui/policies"
        >
          <Icon i="policies"/>{' '}
          Privacy Policies
        </NavLink>
        <NavLink
          tag="a"
          href='#'
          className="text-dark font-italic text-monospace"
        >
          <FontAwesomeIcon icon={faCrosshairs} size="1x" color="green" fixedWidth/>{' '}
          { poemVersion }
        </NavLink>
      </Nav>
    </React.Fragment>
  )
}


const InnerFooter = ({border=false}) =>
(
  <React.Fragment>
    {
      border && <div className="pt-1"/>
    }
    <p className="text-center">
      <small>
        <strong>ARGO POEM</strong> is a service jointly developed and maintained by &nbsp;
        <a href="http://www.cnrs.fr/" title="Centre national de la recherche scientifique">CNRS</a>, &nbsp;
        <a href="https://grnet.gr/" title="Greek Research and Technology Network">GRNET</a> and &nbsp;
        <a href="http://www.srce.unizg.hr/" title="University computing centre">SRCE</a>&nbsp;
        co-funded by <a href="https://www.eosc-hub.eu" title="EOSC-Hub">EOSC-Hub</a> and &nbsp;
        <a href="http://www.egi.eu/" title="EGI.eu">EGI.eu</a>
      </small>
    </p>
    <div className="text-center pb-3 pt-0">
      <img src={EULogo} id="eulogo" alt="EU logo"/>
      <img src={EOSCLogo} id="eosclogo" alt="EOSC logo" className="pl-1"/>
    </div>
  </React.Fragment>
)


export const Footer = ({loginPage=false}) =>
{
  if (!loginPage) {
    return (
      <div id="argo-footer" className="border rounded">
        <InnerFooter border={true}/>
      </div>
    )
  }
  else {
    return (
      <div id="argo-loginfooter">
        <InnerFooter />
      </div>
    )
  }
}


export const LoadingAnim = () =>
(
  <Card className="text-center">
    <CardHeader className="bg-light">
      <h4 className="text-dark">Loading data...</h4>
    </CardHeader>
    <CardBody>
      <img src={ArgoLogoAnim} alt="ARGO logo anim" className="img-responsive" height="410px"/>
    </CardBody>
  </Card>
)


export const NotifyOk = ({msg='', title='', callback=undefined}) => {
  NotificationManager.success(msg,
    title,
    2000);
  setTimeout(callback, 2000);
}


export const NotifyError = ({msg='', title=''}) => {
  msg = <div>
    <p>{msg}</p>
    <p>Click to dismiss.</p>
  </div>
  NotificationManager.error(msg=msg, title, 0, () => true);
};


export const NotifyWarn = ({msg='', title=''}) => {
  msg = <div>
    <p>{msg}</p>
    <p>Click to dismiss.</p>
  </div>
  NotificationManager.warning(msg, title, 0, () => true);
};


export const NotifyInfo = ({msg='', title=''}) => {
  msg = <div>
    <p>{msg}</p>
    <p>Click to dismiss.</p>
  </div>
  NotificationManager.info(msg, title, 0, () => true);
};


export const PublicPage = ({children}) => {
  let userDetails = {
    username: 'Anonymous'
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavigationBar
            history={undefined}
            onLogout={undefined}
            isOpenModal={undefined}
            toggle={() => {}}
            titleModal='Log out'
            msgModal='Are you sure you want to log out?'
            userDetails={userDetails}
            publicView={true}
          />
        </Col>
      </Row>
      <Row className="no-gutters">
        <Col>
          <CustomBreadcrumb publicView={true}/>
          {children}
        </Col>
      </Row>
      <Row>
        <Col>
          <Footer loginPage={false}/>
        </Col>
      </Row>
    </Container>
  )
}


export const BaseArgoView = ({resourcename='', location=undefined,
  infoview=false, addview=false, listview=false, modal=false, state=undefined,
  toggle=undefined, submitperm=true, history=true, addnew=true, clone=false,
  cloneview=false, tenantview=false, publicview=false, addperm=true, children}) =>
(
  <React.Fragment>
    {
      modal &&
      <ModalAreYouSure
        isOpen={state.areYouSureModal}
        toggle={toggle}
        title={state.modalTitle}
        msg={state.modalMsg}
        onYes={state.modalFunc} />
    }
    <div className="d-flex align-items-center justify-content-between">
      {
        infoview ?
          <h2 className="ml-3 mt-1 mb-4">{resourcename}</h2>
        :
          addview ?
            <h2 className="ml-3 mt-1 mb-4">{`Add ${resourcename}`}</h2>
          :
            listview ?
              <React.Fragment>
                {
                  addnew ?
                    <h2 className="ml-3 mt-1 mb-4">{`Select ${resourcename} to change`}</h2>
                  :
                    <h2 className='ml-3 mt-1 mb-4'>{`Select ${resourcename} for details`}</h2>
                }
                {
                  (addnew && addperm) &&
                      <Link className="btn btn-secondary" to={location.pathname + "/add"} role="button">Add</Link>
                }
                {
                  (addnew && !addperm) &&
                    <Button
                      className='btn btn-secondary'
                      onClick={() => NotifyError({
                        title: 'Not allowed',
                        msg: `You do not have permission to add ${resourcename}.`
                      })}
                    >
                      Add
                    </Button>
                }
              </React.Fragment>
            :
              cloneview ?
                <React.Fragment>
                  <h2 className="ml-3 mt-1 mb-4">{`Clone ${resourcename}`}</h2>
                </React.Fragment>
              :
                (tenantview || publicview) ?
                  <React.Fragment>
                    <h2 className="ml-3 mt-1 mb-4">{resourcename}</h2>
                    {
                      history &&
                        <Link className="btn btn-secondary" to={location.pathname + "/history"} role="button">History</Link>
                    }
                  </React.Fragment>
                :
                  <React.Fragment>
                    <h2 className="ml-3 mt-1 mb-4">{`Change ${resourcename}`}</h2>
                    <ButtonToolbar>
                      {
                          clone && !publicview &&
                            <Link className="btn btn-secondary mr-2" to={location.pathname + "/clone"} role="button">Clone</Link>
                      }
                      {
                          history && !publicview &&
                            <Link className="btn btn-secondary" to={location.pathname + "/history"} role="button">History</Link>
                      }
                    </ButtonToolbar>
                  </React.Fragment>
      }
    </div>
    <div id="argo-contentwrap" className="ml-2 mb-2 mt-2 p-3 border rounded">
      {
        !submitperm && !infoview && !listview && !publicview &&
          <Alert color='danger'>
            <center>
              This is a read-only instance, please request the corresponding
              permissions to perform any changes in this form.
            </center>
          </Alert>
      }
      {children}
    </div>
  </React.Fragment>
)


export const Checkbox = ({
  field: { name, value, onChange, onBlur },
  form: { errors, touched },
  id,
  label,
  ...props
}) => {
  return (
    <div>
      <input
        name={name}
        id={id}
        type='checkbox'
        value={value}
        checked={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <label htmlFor={id}>{label}</label>
      {touched[name] && errors[name] && <div className="error">{errors[name]}</div>}
    </div>
  );
};


export const FancyErrorMessage = (msg) => (
  <div style={{color: '#FF0000', fontSize: 'small'}}>{msg}</div>
)


export const AutocompleteField = ({setFieldValue, lists=[], val='', icon, field, req, label, onselect_handler}) => {
  const [inputValue, setInputValue] = useState(val);
  const [suggestions, setSuggestions] = useState(lists);

  const getSuggestions = value => {
    return (
      lists.filter(suggestion =>
        suggestion.toLowerCase().includes(value.trim().toLowerCase())
      )
    );
  };

  const getSuggestionValue = suggestion => suggestion;

  const renderSuggestion = (suggestion, {isHighlighted}) => (
    <div
      key={lists.indexOf(suggestion)}
      className={`argo-autocomplete-entries ${isHighlighted ?
        'argo-autocomplete-entries-highlighted' : ''}`}
    >
      {suggestion ? <Icon i={icon}/> : ''} {suggestion}
    </div>
  );

  const renderInputComponent = inputProps => {
    if (label)
      return (
        <div className='input-group mb-3'>
          <div className='input-group-prepend'>
            <span className='input-group-text' id='basic-addon1'>{label}</span>
          </div>
          <input {...inputProps} type='text'
          className={`form-control ${req && 'border-danger'}`} aria-label='label'/>
        </div>
      );
    else
      return (<input {...inputProps} type='text' className='form-control'/>);
  }

  return (
    <div>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsClearRequested={() => setSuggestions([])}
        onSuggestionsFetchRequested={({ value }) => {
          setInputValue(value);
          setSuggestions(getSuggestions(value));
        }}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          value: inputValue,
          onChange: (_, { newValue }) => {
            setInputValue(newValue);
            setFieldValue(field, newValue);
            onselect_handler(field, newValue);
          }
        }}
        renderInputComponent={renderInputComponent}
        shouldRenderSuggestions={() => true}
        theme={{
          containerOpen: 'argo-autocomplete-menu',
          suggestionsList: 'argo-autocomplete-list'
        }}
      />
    </div>
  );
};


export const DropdownFilterComponent = ({value, onChange, data}) => (
  <select
    onChange={onChange}
    style={{width: '100%'}}
    value={value}
  >
    <option key={0} value=''>Show all</option>
    {
      data.map((name, i) =>
        <option key={i + 1} value={name}>{name}</option>
      )
    }
  </select>
)


export function HistoryComponent(obj, tenantview=false) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.name = props.match.params.name;
      this.history = props.history;
      this.publicView = props.publicView

      this.state = {
        loading: false,
        list_versions: null,
        compare1: '',
        compare2: '',
        error: null
      };

      if (!this.publicView) {
        if (['metric', 'metricprofile', 'aggregationprofile', 'thresholdsprofile'].includes(obj))
          this.apiUrl = '/api/v2/internal/tenantversion/'
        else
          this.apiUrl = '/api/v2/internal/version/'
      }
      else {
        if (['metric', 'metricprofile', 'aggregationprofile', 'thresholdsprofile'].includes(obj))
          this.apiUrl = '/api/v2/internal/public_tenantversion/'
        else
          this.apiUrl = '/api/v2/internal/public_version/'
      }

      if (tenantview)
        this.compareUrl = `/ui/administration/${obj}s/${this.name}/history`;
      else {
        if (this.publicView)
          this.compareUrl = `/ui/public_${obj}s/${this.name}/history`;
        else
          this.compareUrl = `/ui/${obj}s/${this.name}/history`;
      }

      this.backend = new Backend();
    }

    async componentDidMount() {
      this.setState({loading: true});

      try {
        let json = await this.backend.fetchData(`${this.apiUrl}/${obj}/${this.name}`);
        if (json.length > 1) {
          this.setState({
            list_versions: json,
            loading: false,
            compare1: json[0].version,
            compare2: json[1].version
          });
        } else {
          this.setState({
            list_versions: json,
            loading: false
          });
        };
      } catch(err) {
        this.setState({
          error: err,
          loading: false
        });
      };
    }

    render() {
      const { loading, list_versions, error } = this.state;

      if (loading)
        return (<LoadingAnim />);

      else if (error)
        return (<ErrorComponent error={error}/>);

      else if (!loading && list_versions) {
        return (
          <BaseArgoView
            resourcename='Version history'
            infoview={true}>
            <table className='table table-sm'>
              <thead className='table-active'>
                <tr>
                  { list_versions.length === 1 ?
                    <th scope='col'>Compare</th>
                    :
                    <th scope='col'>
                      <Button
                          color='info'
                          onClick={() =>
                            this.history.push(
                              `${this.compareUrl}/compare/${this.state.compare1}/${this.state.compare2}`,
                          )
                          }
                        >
                          Compare
                      </Button>
                    </th>
                    }
                  <th scope='col'>Version</th>
                  <th scope='col'>Date/time</th>
                  <th scope='col'>User</th>
                  <th scope='col'>Comment</th>
                </tr>
              </thead>
              <tbody>
                {
                    list_versions.map((e, i) =>
                      <tr key={i}>
                        {
                          list_versions.length === 1 ?
                            <td>-</td>
                          :
                            i === 0 ?
                              <td>
                                <input
                                type='radio'
                                name='radio-1'
                                value={e.version}
                                defaultChecked={true}
                                onChange={e => this.setState({compare1: e.target.value})}
                              />
                              </td>
                            :
                              <td>
                                <input
                                type='radio'
                                name='radio-1'
                                value={e.version}
                                onChange={e => this.setState({compare1: e.target.value})}
                              />
                                {' '}
                                <input
                                type='radio'
                                name='radio-2'
                                value={e.version}
                                defaultChecked={i===1}
                                onChange={e => this.setState({compare2: e.target.value})}
                              />
                              </td>
                        }
                        {
                          <td>
                            {e.version ? <Link to={`${this.compareUrl}/${e.version}`}>{e.version}</Link> : ''}
                          </td>
                        }
                        <td>
                          {e.date_created ? e.date_created : ''}
                        </td>
                        <td>
                          {e.user ? e.user : ''}
                        </td>
                        <td className='col-md-6'>
                          {e.comment ? e.comment : ''}
                        </td>
                      </tr>
                    )
                  }
              </tbody>
            </table>
          </BaseArgoView>
        );
      }
      else
        return null;
    }
  }
}


export const DiffElement = ({title, item1, item2}) => {
  item1 = item1.split('\r\n');
  item2 = item2.split('\r\n');

  let n = Math.max(item1.length, item2.length);

  if (item1.length > item2.length) {
    for (let i=item2.length; i < item1.length; i++) {
      item2.push(' ');
    }
  } else if (item2.length > item1.length) {
    for (let i=item1.length; i < item2.length; i++) {
      item1.push(' ');
    }
  }

  const elements = [];
  for (let i = 0; i < n; i++) {
    elements.push(
      <ReactDiffViewer
      oldValue={item2[i]}
      newValue={item1[i]}
      showDiffOnly={true}
      splitView={false}
      hideLineNumbers={true}
      disableWordDiff={true}
      key={'diff-' + i}
    />
    );
  }

  return (
    <div id='argo-contentwrap' className='ml-2 mb-2 mt-2 p-3 border rounded'>
      <h6 className='mt-4 font-weight-bold text-uppercase'>{title}</h6>
      {elements}
    </div>
  );
};


export const ProfileMainInfo = ({errors, grouplist=undefined, description=undefined,
  fieldsdisable=false, profiletype=undefined }) => (
    <FormGroup>
      <Row>
        <Col md={6}>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Name</InputGroupAddon>
            <Field
            type='text'
            name='name'
            className={`form-control form-control-lg ${errors.name && 'border-danger'}`}
            disabled={fieldsdisable}
          />
          </InputGroup>
          {
          errors.name &&
            FancyErrorMessage(errors.name)
        }
          <FormText color='text-muted'>
            {`Name of ${profiletype} profile`}
          </FormText>
        </Col>
      </Row>
      {
      description &&
        <Row className='mt-3'>
          <Col md={10}>
            <Label for="profileDescription">Description:</Label>
            <Field
              id="profileDescription"
              className="form-control"
              component="textarea"
              name={description}
              disabled={fieldsdisable}/>
            <FormText color='muted'>
              Free text description outlining the purpose of this profile.
            </FormText>
          </Col>
        </Row>
    }
      <Row className='mt-4'>
        <Col md={3}>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Group</InputGroupAddon>
            {
            fieldsdisable ?
              <Field
                type='text'
                name='groupname'
                className='form-control'
                disabled={true}
              />
            :
              <Field
                name='groupname'
                component='select'
                className={`form-control custom-select ${errors.groupname && 'border-danger'}`}
              >
                <option key={0} value='' hidden color='text-muted'>Select group</option>
                {
                  grouplist.map((group, i) =>
                    <option key={i + 1} value={group}>{group}</option>
                  )
                }
              </Field>
          }
          </InputGroup>
          {
          errors.groupname &&
            FancyErrorMessage(errors.groupname)
        }
          <FormText color='muted'>
            {`${profiletype.charAt(0).toUpperCase() + profiletype.slice(1)} profile is member of given group.`}
          </FormText>
        </Col>
      </Row>
    </FormGroup>
);


export const ErrorComponent = ({error}) => {
  let errors = [];
  error.toString().split('; ').forEach((e, i) => {
    if (i === 0)
      errors.push(<h3 key={i}>{e}</h3>)
    else
      errors.push(<p key={i}>{e}</p>)

  })

  return (
    <React.Fragment>
      <h1>Something went wrong</h1>
      {errors}
    </React.Fragment>
  )
}


export const ParagraphTitle = ({title}) => (
  <h4 className="mt-2 p-1 pl-3 text-uppercase rounded" style={{"backgroundColor": "#c4ccd4"}}>{title}</h4>
)
