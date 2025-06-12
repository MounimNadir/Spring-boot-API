import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal, Form, Input, Switch, message } from "antd";
import { MailOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import "../../style/adminPage.css";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [emailModalVisible, setEmailModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [emailForm] = Form.useForm();
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllUsers();
            console.log("Users data:", data);
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            message.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            const response = await ApiService.toggleUserStatus(userId);
            setUsers(users.map(user => 
                user.id === userId ? { ...user, enabled: response.enabled } : user
            ));
            message.success(`User status updated successfully`);
        } catch (error) {
            console.error("Error toggling user status:", error);
            message.error("Failed to update user status");
        }
    };

    const showEmailModal = (user) => {
        setSelectedUser(user);
        setEmailModalVisible(true);
    };

    const handleSendEmail = async (values) => {
        try {
            await ApiService.sendUserEmail(selectedUser.id, values.subject, values.message);
            message.success(`Email sent to ${selectedUser.email}`);
            setEmailModalVisible(false);
            emailForm.resetFields();
        } catch (error) {
            console.error("Error sending email:", error);
            message.error("Failed to send email");
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => role === 'ADMIN' ? 'Admin' : 'User'
        },
        {
            title: 'Disable',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (enabled, record) => (
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={enabled}
                    onChange={() => handleToggleStatus(record.id)}
                />
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button 
                    type="primary" 
                    icon={<MailOutlined />} 
                    onClick={() => showEmailModal(record)}
                >
                    Send Email
                </Button>
            )
        }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="admin-page">
            <h1>User Management</h1>
            
            <div className="action-buttons" style={{ marginBottom: 16 }}>
                <Button onClick={() => navigate("/admin")}>Back to Dashboard</Button>
            </div>
            
            <Table 
                columns={columns} 
                dataSource={users} 
                loading={loading}
                rowKey="id"
                bordered
                pagination={{ pageSize: 10 }}
            />
            
            <Modal
                title={`Send Email to ${selectedUser?.name || 'User'}`}
                open={emailModalVisible}
                onCancel={() => setEmailModalVisible(false)}
                footer={null}
            >
                <Form
                    form={emailForm}
                    onFinish={handleSendEmail}
                    layout="vertical"
                >
                    <Form.Item
                        label="Subject"
                        name="subject"
                        rules={[{ required: true, message: 'Please input email subject!' }]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        label="Message"
                        name="message"
                        rules={[{ required: true, message: 'Please input email message!' }]}
                    >
                        <Input.TextArea rows={6} />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Send Email
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;