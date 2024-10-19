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
    tags: [ 'nice', 'developer' ],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: [ 'loser' ],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: [ 'cool', 'teacher' ],
  },
  {
    key: '4',
    name: 'Sara White',
    age: 28,
    address: 'New York No. 2 Lake Park',
    tags: [ 'friendly', 'designer' ],
  },
  {
    key: '5',
    name: 'Mike Johnson',
    age: 36,
    address: 'Tokyo No. 3 Lake Park',
    tags: [ 'hardworking', 'engineer' ],
  },
  {
    key: '6',
    name: 'Lucy Brown',
    age: 30,
    address: 'Paris No. 4 Lake Park',
    tags: [ 'charming', 'nurse' ],
  },
  {
    key: '7',
    name: 'David Miller',
    age: 45,
    address: 'London No. 2 Lake Park',
    tags: [ 'strict', 'manager' ],
  },
  {
    key: '8',
    name: 'Anna Smith',
    age: 29,
    address: 'Berlin No. 5 Lake Park',
    tags: [ 'creative', 'artist' ],
  },
  {
    key: '9',
    name: 'Robert Lee',
    age: 41,
    address: 'New York No. 6 Lake Park',
    tags: [ 'smart', 'doctor' ],
  },
  {
    key: '10',
    name: 'Maria Garcia',
    age: 38,
    address: 'Madrid No. 1 Lake Park',
    tags: [ 'calm', 'chef' ],
  },
  {
    key: '11',
    name: 'James Wilson',
    age: 34,
    address: 'Rome No. 2 Lake Park',
    tags: [ 'active', 'athlete' ],
  },
  {
    key: '12',
    name: 'Emily Davis',
    age: 26,
    address: 'Sydney No. 3 Lake Park',
    tags: [ 'energetic', 'student' ],
  },
  {
    key: '13',
    name: 'Daniel Robinson',
    age: 33,
    address: 'Tokyo No. 4 Lake Park',
    tags: [ 'dedicated', 'researcher' ],
  },
  {
    key: '14',
    name: 'Sophia Martinez',
    age: 31,
    address: 'Paris No. 5 Lake Park',
    tags: [ 'helpful', 'volunteer' ],
  },
  {
    key: '15',
    name: 'William Clark',
    age: 39,
    address: 'Berlin No. 1 Lake Park',
    tags: [ 'funny', 'comedian' ],
  },
  {
    key: '16',
    name: 'Olivia Lewis',
    age: 27,
    address: 'Rome No. 3 Lake Park',
    tags: [ 'thoughtful', 'writer' ],
  },
  {
    key: '17',
    name: 'Henry Young',
    age: 46,
    address: 'London No. 3 Lake Park',
    tags: [ 'serious', 'lawyer' ],
  },
  {
    key: '18',
    name: 'Isabella King',
    age: 25,
    address: 'New York No. 7 Lake Park',
    tags: [ 'adventurous', 'traveler' ],
  },
  {
    key: '19',
    name: 'Jacob Wright',
    age: 37,
    address: 'Sydney No. 4 Lake Park',
    tags: [ 'passionate', 'musician' ],
  },
  {
    key: '20',
    name: 'Ava Scott',
    age: 35,
    address: 'Madrid No. 2 Lake Park',
    tags: [ 'organized', 'planner' ],
  },
];

const ProductsTable = () => {
  return (
    <div className='p-3'>
      <Table columns={columns} dataSource={data} pagination={{pageSize: 5}} />
    </div>
  )
}

export default ProductsTable