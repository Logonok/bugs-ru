'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Полный доступ к данным',
        roles: 'administrator',
        type: 'allow',
        actions: 'all',
        targets: {
            type: 'all'
        }
    }, {
        description: 'Читать все данные',
        roles: 'employee',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'all'
        }
    }, {
        description: 'Создавать комментарии, документы, работу',
        roles: 'employee',
        type: 'allow',
        actions: 'create',
        targets: {
            type: 'class',
            class: ['comment', 'document', 'work']
        }
    }, {
        description: 'Управлять собственными данными',
        roles: 'employee',
        type: 'allow',
        actions: ['read', 'update', 'delete'],
        targets: {
            type: 'class',
            class: ['task', 'comment', 'work']
        },
        rule: 'author'
    }, {
        description: 'Управлять собственными документами',
        roles: 'employee',
        type: 'allow',
        actions: ['read', 'update', 'delete'],
        targets: {
            type: 'class',
            class: 'document'
        },
        rule: 'creator'
    }, {
        description: 'Сотрудник не может изменять состояние задач',
        roles: 'employee',
        type: 'deny',
        actions: 'update',
        targets: {
            type: 'transition',
            class: 'task'
        }
    }, {
        description: 'Менеджер может создавать задачи',
        roles: 'manager',
        type: 'allow',
        actions: 'create',
        targets: {
            type: 'class',
            class: 'task'
        }
    }, {
        description: 'Менеджер может изменять состояние собственных задач',
        roles: 'manager',
        type: 'allow',
        actions: 'update',
        targets: {
            type: 'transition',
            class: 'task'
        },
        rule: 'author'
    }, {
        description: 'Исполнитель может изменять состояние задач назначенных ему',
        roles: 'executor',
        type: 'allow',
        actions: 'update',
        targets: {
            type: 'transition',
            class: 'task'
        },
        rule: 'executor'
    }, {
        description: 'Менеджер не может начинать, останавливать и завершать работу над задачей',
        roles: 'manager',
        type: 'deny',
        actions: 'update',
        targets: {
            type: 'transition',
            class: 'task',
            transition: ['start', 'stop', 'complete']
        }
    }, {
        description: 'Исполнитель не может отклонять, закрывать и переоткрывать задачу',
        roles: 'executor',
        type: 'deny',
        actions: 'update',
        targets: {
            type: 'transition',
            class: 'task',
            transition: ['reject', 'close', 'reopen']
        }
    }],

    permissions: {
        ...parent.permissions,

        'moduleAdmin': {
            label: 'Модуль Администрирования',
            description: 'Доступ к модулю Администрирования'
        },
        'moduleOffice': {
            label: 'Модуль Офис',
            description: 'Доступ к модулю Офис'
        },
        'moduleStudio': {
            label: 'Мудуль Студия',
            description: 'Доступ к модулю Студия'
        },
        'moduleApiBaseUpload': {
            label: 'Загрузка файлов',
            description: 'Загрузка файлов через базовый модуль API метаданных'
        }
    },

    roles: {
        'administrator': {
            label: 'Администратор',
            description: 'Полный доступ к данным',
            children: [
                'moduleAdmin',
                'moduleOffice',
                'moduleStudio',
                'moduleApiBaseUpload'
            ]
        },
        'guest': {
            label: 'Гость',
            description: 'Автоназначаемая роль для анонимных пользователей'
        },
        'executor': {
            label: 'Исполнитель',
            description: 'Сотрудник, решающий задачи'
        },
        'manager': {
            label: 'Менеджер',
            description: 'Сотрудник, создающий и проверяющий задачи'
        },
        'employee': {
            label: 'Сотрудник',
            description: 'Сотрудник команды',
            children: [
                'moduleOffice',
                'moduleApiBaseUpload'
            ]
        }
    },

    rules: {
        'creator': {
            label: 'Создатель',
            description: 'Проверить является ли пользователь создателем объекта',
            config: {
                Class: 'evado/component/meta/rbac/rule/UserRule',
                userAttr: '_creator'
            }
        },
        'author': {
            label: 'Автор',
            description: 'Проверить авторство через привязку пользователя к связанному объекту сотрудника',
            config: {
                Class: 'evado/component/meta/rbac/rule/RefUserRule',
                refAttr: 'author'
            }
        },
        'executor': {
            label: 'Исполнитель',
            description: 'Проверить исполнителя через привязку пользователя к связанному объекту сотрудника',
            config: {
                Class: 'evado/component/meta/rbac/rule/RefUserRule',
                refAttr: 'executor'
            }
        },
        'user': {
            label: 'Пользователь',
            description: 'Прверить привязку пользователя',
            config: {
                Class: 'evado/component/meta/rbac/rule/UserRule'
            }
        }
    },

    // привязка пользователей к ролям
    assignments: {
        'Adam': 'administrator',
        'Bob': ['executor', 'employee'],
        'Sara': ['manager', 'employee']
    }
};