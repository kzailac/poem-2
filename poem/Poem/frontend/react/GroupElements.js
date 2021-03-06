import React, { useState, useEffect } from 'react';
import { Backend } from './DataManager';
import {
  LoadingAnim,
  BaseArgoView,
  NotifyOk,
  NotifyError,
  ErrorComponent,
  ParagraphTitle,
  Icon,
  SearchField,
  BaseArgoTable
} from './UIElements';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  FormGroup,
  Row,
  Col,
  Button,
  InputGroup,
  InputGroupAddon} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';


export const GroupList = (props) => {
  const [loading, setLoading] = useState(false);
  const [listGroups, setListGroups] = useState(null);
  const [error, setError] = useState(null);

  const location = props.location;
  const name = props.name;
  const id = props.id;
  const group = props.group;

  useEffect(() => {
    setLoading(true);
    const backend = new Backend();
    async function fetchData() {
      try {
        let json = await backend.fetchResult('/api/v2/internal/usergroups');
        setListGroups(json[group]);
      } catch(err) {
        setError(err);
      }
      setLoading(false);
    }
    fetchData();
  }, [group]);

  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: null,
        column_width: '2%'
      },
      {
        Header: name.charAt(0).toUpperCase() + name.slice(1),
        accessor: e =>
          <Link to={`/ui/administration/${id}/${e}`}>
            {e}
          </Link>,
        column_width: '98%'
      }
    ], [name, id]
  );

  if (loading)
    return (<LoadingAnim/>);

  else if (error)
    return (<ErrorComponent error={error}/>);

  else if (!loading && listGroups)
    return (
      <BaseArgoView
        resourcename={name}
        location={location}
        listview={true}>
        <BaseArgoTable
          data={listGroups}
          columns={columns}
          page_size={10}
          resourcename='groups'
        />
      </BaseArgoView>
    );

  else
    return null;
};


export const GroupChange = (props) => {
  const [name, setName] = useState('');
  var [items, setItems] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  var [freeItems, setFreeItems] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [areYouSureModal, setAreYouSureModal] = useState(undefined);
  const [modalTitle, setModalTitle] = useState(undefined);
  const [modalMsg, setModalMsg] = useState(undefined);
  const [modalFlag, setModalFlag] = useState(undefined);
  const [error, setError] = useState(null);
  const [formName, setFormName] = useState('');

  const groupname = props.match.params.name;
  const group = props.group;
  const id = props.id;
  const title = props.title;
  const addview = props.addview;

  const location = props.location;
  const history = props.history;

  const backend = new Backend();

  function toggleAreYouSure() {
    setAreYouSureModal(!areYouSureModal);
  }

  function onSubmitHandle(values) {
    setModalMsg(`Are you sure you want to ${addview ? 'add' : 'change'} group of ${title}?`);
    setModalTitle(`${addview ? 'Add' : 'Change'} group of ${title}`);
    setModalFlag('submit');
    setFormName(values.name);
    toggleAreYouSure();
  }

  function onDeleteHandle() {
    setModalMsg(`Are you sure you want to delete group of ${title}?`);
    setModalTitle(`Delete group of ${title}`);
    setModalFlag('delete');
    toggleAreYouSure();
  }

  async function doChange() {
    if (!addview) {
      let response = await backend.changeObject(
        `/api/v2/internal/${group}group/`,
        {name: formName, items: items}
      );

      if (response.ok)
        NotifyOk({
          msg: `Group of ${title} successfully changed`,
          title: 'Changed',
          callback: () => history.push(`/ui/administration/${id}`)
        });

      else {
        let change_msg = '';
        try {
          let json = await response.json();
          change_msg = json.detail;
        } catch(err) {
          change_msg = `Error changing group of ${title}`;
        }
        NotifyError({
          title: `Error: ${response.status} ${response.statusText}`,
          msg: change_msg
        });
      }
    } else {
      let response = await backend.addObject(
        `/api/v2/internal/${group}group/`,
        {name: formName, items: items}
      );

      if (response.ok)
        NotifyOk({
          msg: `Group of ${title} successfully added`,
          title: 'Added',
          callback: () => history.push(`/ui/administration/${id}`)
        });

      else {
        let add_msg = '';
        try {
          let json = await response.json();
          add_msg = json.detail;
        } catch(err) {
          add_msg = `Error adding group of ${title}`;
        }
        NotifyError({
          title: `Error: ${response.status} ${response.statusText}`,
          msg: add_msg
        });
      }
    }
  }

  async function doDelete() {
    let response = await backend.deleteObject(`/api/v2/internal/${group}group/${name}`);

    if (response.ok)
      NotifyOk({
        msg: `Group of ${title} successfully deleted`,
        title: 'Deleted',
        callback: () => history.push(`/ui/administration/${id}`)
      });

    else {
      let msg = '';
      try {
        let json = await response.json();
        msg = json.detail;
      } catch(err) {
        msg = `Error deleting group of ${title}`;
      }
      NotifyError({
        title: `Error: ${response.status} ${response.statusText}`,
        msg: msg
      });
    }
  }

  useEffect(() => {
    setLoading(true);

    async function fetchItems() {
      try {
        let nogroupitems_response = await backend.fetchResult(`/api/v2/internal/${group}group`);
        let nogroupitems = [];
        nogroupitems_response.forEach(e => nogroupitems.push({value: e, label: e}));

        if (!addview) {
          let groupitems = await backend.fetchResult(`/api/v2/internal/${group}group/${groupname}`);
          setName(groupname);
          setItems(groupitems);
        }
        setFreeItems(nogroupitems);
      } catch(err) {
        setError(err);
      }
      setLoading(false);
    }

    fetchItems();
  }, []);

  var filteredItems = items;
  if (searchItem)
    filteredItems = filteredItems.filter(filteredRow =>
      filteredRow.toLowerCase().includes(searchItem.toLowerCase())
    );

  if (loading)
    return (<LoadingAnim/>);

  else if (error)
    return (<ErrorComponent error={error}/>);

  else if (!loading) {
    return (
      <BaseArgoView
        resourcename={`group of ${title}`}
        location={location}
        addview={addview}
        history={false}
        modal={true}
        state={{
          areYouSureModal,
          'modalFunc': modalFlag === 'delete' ?
            doDelete
          :
            modalFlag === 'submit' ?
              doChange
            :
              undefined,
          modalTitle,
          modalMsg
        }}
        toggle={toggleAreYouSure}
      >
        <Formik
          initialValues = {{
            name: name,
            items: items
          }}
          onSubmit = {(values) => onSubmitHandle(values)}
        >
          {() => (
            <Form>
              <FormGroup>
                <Row>
                  <Col md={6}>
                    <InputGroup>
                      <InputGroupAddon addonType='prepend'>Name</InputGroupAddon>
                      <Field
                        type='text'
                        name='name'
                        data-testid='name'
                        required={true}
                        className='form-control'
                        id='groupname'
                        disabled={!addview}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <ParagraphTitle title={title}/>
                <Row className='mb-2'>
                  <Col md={8} data-testid='available_metrics' >
                    <Select
                      closeMenuOnSelect={false}
                      placeholder={`Search available ${title}`}
                      noOptionsMessage={() => `No available ${title}`}
                      isMulti
                      onChange={e => setNewItems(e)}
                      openMenuOnClick={true}
                      value={newItems}
                      options={freeItems}
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      color='success'
                      onClick={() => {
                        let itms = items;
                        let fitms = freeItems;
                        for (let i = 0; i < fitms.length; i++) {
                          if (newItems.includes(fitms[i])) {
                            fitms.splice(i, 1);
                            i--;
                          }
                        }
                        newItems.forEach(i => itms.push(i.value));
                        setItems(itms.sort());
                        setFreeItems(fitms);
                        setNewItems([]);
                      }}
                    >
                      {`Add new ${title} to group`}
                    </Button>
                  </Col>
                </Row>
                <table className='table table-bordered table-sm table-hover' style={{width: '85%'}}>
                  <thead className='table-active'>
                    <tr>
                      <th className='align-middle text-center' style={{width: '5%'}}>#</th>
                      <th style={{width: '90%'}}><Icon i={group === 'aggregations' ? 'aggregationprofiles' : group}/> {`${title.charAt(0).toUpperCase() + title.slice(1)} in group`}</th>
                      <th style={{width: '5%'}}>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{background: '#ECECEC'}}>
                      <td className='align-middle text-center'>
                        <FontAwesomeIcon icon={faSearch}/>
                      </td>
                      <td>
                        <Field
                          type='text'
                          name='search_items'
                          data-testid='search_items'
                          className='form-control'
                          onChange={(e) => setSearchItem(e.target.value)}
                          component={SearchField}
                        />
                      </td>
                      <td>{''}</td>
                    </tr>
                    {
                      filteredItems.map((item, index) =>
                        <React.Fragment key={index}>
                          <tr key={index}>
                            <td className='align-middle text-center'>
                              {index + 1}
                            </td>
                            <td>{item}</td>
                            <td className='align-middle pl-3'>
                              <Button
                                size='sm'
                                color='light'
                                type='button'
                                onClick={() => {
                                  let updatedItems = items.filter(updatedRow => updatedRow !== item);
                                  let fitms = freeItems;
                                  fitms.push({value: item, label: item});
                                  let sorted_fitms = fitms.sort((a, b) => {
                                    let comparison = 0
                                    if (a.value.toLowerCase() > b.value.toLowerCase())
                                      comparison = 1;

                                    else if (a.value.toLowerCase() < b.value.toLowerCase())
                                      comparison = -1;

                                    return comparison;
                                  });
                                  setItems(updatedItems);
                                  setFreeItems(sorted_fitms);
                                }}
                              >
                                <FontAwesomeIcon icon={faTimes}/>
                              </Button>
                            </td>
                          </tr>
                        </React.Fragment>
                      )
                    }
                  </tbody>
                </table>
              </FormGroup>
              {
                <div className='submit-row d-flex align-items-center justify-content-between bg-light p-3 mt-5'>
                  {
                    !addview ?
                      <Button
                        color='danger'
                        onClick={() => onDeleteHandle()}
                      >
                        Delete
                      </Button>
                    :
                      <div></div>
                  }
                  <Button
                    color='success'
                    id='submit-button'
                    type='submit'
                  >
                    Save
                  </Button>
                </div>
              }
            </Form>
          )}
        </Formik>
      </BaseArgoView>
    );
  }
  else
    return null;
};
