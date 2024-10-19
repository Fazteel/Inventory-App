import React from 'react';
import { Space, Table, Tag } from 'antd';

const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
    render: (text, record, index) => index + 1,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a className='bg-yellow-600 px-2 py-1 rounded-lg text-white'>Edit</a>
        <a className='bg-red-600 px-2 py-1 rounded-lg text-white'>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '4',
    name: 'Sara White',
    age: 28,
    address: 'New York No. 2 Lake Park',
    tags: ['friendly', 'designer'],
  },
  {
    key: '5',
    name: 'Mike Johnson',
    age: 36,
    address: 'Tokyo No. 3 Lake Park',
    tags: ['hardworking', 'engineer'],
  },
];

const UsersTable = () => {
  return (
    <div className='p-3'>
      <Table columns={columns} dataSource={data} pagination={{pageSize: 5}} />
    </div>
  );
};

export default UsersTable;
