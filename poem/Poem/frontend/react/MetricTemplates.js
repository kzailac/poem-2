import React, { Component } from 'react';
import { ListOfMetrics, InlineFields, ProbeVersionLink } from './Metrics';
import { Backend } from './DataManager';
import { LoadingAnim, BaseArgoView } from './UIElements';
import { Formik, Form, Field } from 'formik';
import {
  FormGroup,
  Row,
  Col,
  Label,
  FormText,
  Popover,
  PopoverBody,
  PopoverHeader} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export const MetricTemplateList = ListOfMetrics('metrictemplate');


export class MetricTemplateChange extends Component {
  constructor(props) {
    super(props);

    this.name = props.match.params.name;
    this.addview = props.addview;
    this.location = props.location;
    this.backend = new Backend();

    this.state = {
      metrictemplate: {},
      probe: {},
      loading: false,
      popoverOpen: false,
      write_perm: false,
      areYouSureModal: false,
      modalFunc: undefined,
      modalTitle: undefined,
      modalMsg: undefined
    };

    this.toggleAreYouSure = this.toggleAreYouSure.bind(this);
    this.toggleAreYouSureSetModal = this.toggleAreYouSureSetModal.bind(this);
    this.togglePopOver = this.togglePopOver.bind(this);
  }

  togglePopOver() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    })
  }

  toggleAreYouSure() {
    this.setState(prevState => 
      ({areYouSureModal: !prevState.areYouSureModal}));
  }

  toggleAreYouSureSetModal(msg, title, onyes) {
    this.setState(prevState => 
      ({areYouSureModal: !prevState.areYouSureModal,
        modalFunc: onyes,
        modalMsg: msg,
        modalTitle: title,
      }));
  }

  componentDidMount() {
    this.setState({loading: true});

    if (!this.addview) {
      this.backend.fetchMetricTemplateByName(this.name)
        .then(metrictemplate => {
          metrictemplate.probekey ?
            this.backend.fetchVersions('probe', metrictemplate.probeversion.split(' ')[0])
              .then(probe => {
                let fields = {};
                probe.forEach((e) => {
                  if (e.id === metrictemplate.probekey) {
                    fields = e.fields;
                  }
                });
                this.setState({
                  metrictemplate: metrictemplate,
                  probe: fields,
                  loading: false,
                  write_perm: localStorage.getItem('authIsSuperuser') === 'true'
                })
              })
            :
            this.setState({
              metrictemplate: metrictemplate,
              loading: false,
              write_perm: localStorage.getItem('authIsSuperuser') === 'true'
            })
        })
    }
  }

  render() {
    const { metrictemplate, loading, write_perm } = this.state;

    if (loading)
      return (<LoadingAnim/>)
    
    else if (!loading) {
      return (
        <BaseArgoView
          resourcename='Metric templates'
          location={this.location}
          addview={this.addview}
          modal={true}
          state={this.state}
          toggle={this.toggleAreYouSure}
          submitperm={write_perm}
        >
          <Formik 
            initialValues = {{
              name: metrictemplate.name,
              probe: metrictemplate.probeversion,
              type: metrictemplate.mtype,
              probeexecutable: metrictemplate.probeexecutable,
              parent: metrictemplate.parent,
              config: metrictemplate.config,
              attributes: metrictemplate.attribute,
              dependency: metrictemplate.dependency,
              parameter: metrictemplate.parameter,
              flags: metrictemplate.flags,
              file_attributes: metrictemplate.files,
              file_parameters: metrictemplate.fileparameter
            }}
            render = {props => (
              <Form>
                <FormGroup>
                  <Row className='mb-3'>
                    <Col md={4}>
                      <Label to='name'>Name</Label>
                      <Field
                        type='text'
                        name='name'
                        required={true}
                        className='form-control'
                        id='name'
                      />
                      <FormText color='muted'>
                        Metric name
                      </FormText>
                    </Col>
                    <Col md={4}>
                      <Label to='probeversion'>Probe</Label>
                      <Field
                        type='text'
                        name='probe'
                        className='form-control'
                        id='probeversion'
                      />
                      <FormText color='muted'>
                        Probe name and version <FontAwesomeIcon id='probe-popover' hidden={this.state.metrictemplate.mtype === 'Passive'} icon={faInfoCircle} style={{color: '#416090'}}/>
                        <Popover placement='bottom' isOpen={this.state.popoverOpen} target='probe-popover' toggle={this.togglePopOver} trigger='hover'>
                          <PopoverHeader><ProbeVersionLink probeversion={this.state.metrictemplate.probeversion}/></PopoverHeader>
                          <PopoverBody>{this.state.probe.description}</PopoverBody>
                        </Popover>
                      </FormText>
                    </Col>
                    <Col md={2}>
                      <Label to='mtype'>Type</Label>
                      <Field
                        type='text'
                        name='type'
                        className='form-control'
                        id='mtype'
                      />
                      <FormText color='muted'>
                        Metric is of given type
                      </FormText>
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                <h4 className="mt-2 p-1 pl-3 text-light text-uppercase rounded" style={{"backgroundColor": "#416090"}}>Metric configuration</h4>
                <h6 className='mt-4 font-weight-bold text-uppercase' hidden={props.values.type === 'Passive'}>probe executable</h6>
                <Row>
                  <Col md={5}>
                    <Field
                      type='text'
                      name='probeexecutable'
                      id='probeexecutable'
                      className='form-control'
                      hidden={props.values.type === 'Passive'}
                    />
                  </Col>
                </Row>
                <InlineFields {...props} field='config' addnew={true}/>
                <InlineFields {...props} field='attributes' addnew={true}/>
                <InlineFields {...props} field='dependency' addnew={true}/>
                <InlineFields {...props} field='parameter' addnew={true}/>
                <InlineFields {...props} field='flags' addnew={true}/>
                <InlineFields {...props} field='file_attributes' addnew={true}/>
                <InlineFields {...props} field='file_parameters' addnew={true}/>
                <h6 className='mt-4 font-weight-bold text-uppercase'>parent</h6>
                <Row>
                  <Col md={5}>
                    <Field
                      type='text'
                      name='parent'
                      id='parent'
                      className='form-control'
                    />
                  </Col>
                </Row>
                </FormGroup>
              </Form>
            )}
          />        
        </BaseArgoView>
      )
    }
  }
}
