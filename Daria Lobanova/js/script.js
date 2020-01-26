var module = (function() {
    var todoTasks = [];
    var doneTasks = [];

    return {

        Task: function(status, title, deadline) {
            this.status = status;
            this.title = title;
            this.deadline = deadline;
        },

        init: function() {
            todoTasks = JSON.parse(localStorage.getItem('todo'));
            doneTasks = JSON.parse(localStorage.getItem('done'));
            
            for (var i = 0; i < todoTasks.length; i++) {
                this.createTask('todo');
                this.setValues(i, 'todo', todoTasks[i]);
            }

            for (var i = 0; i < doneTasks.length; i++) {
                this.createTask('done');
                this.setValues(i, 'done', doneTasks[i]);
            }
        },

        setValues: function(id, name, item) {
            var parent = document.getElementById(name);
            var child = parent.children[id];          

            child.children[0].value = item.status;
            child.children[1].value = item.title;
            child.children[2].value = item.deadline;

            return item = new this.Task(item.status, item.title, item.deadline); 
        },

        addEmptyTask: function(item) {
            var status = item.children[0].checked;
            var title = item.children[1].value;
            var deadline = item.children[2].value;
            return todoTasks.push(new this.Task(status, title, deadline));
        },

        createTask: function(name) {
            var parent = document.getElementById(name);           
            var item = document.createElement('li'); 
            var status = document.createElement('input'); 
            var title = document.createElement('input'); 
            var deadline = document.createElement('input');
            var del = document.createElement('button'); 
       
            status.setAttribute('id', 'status');
            status.setAttribute('type', 'checkbox');
        
            title.setAttribute('id', 'title');
            title.setAttribute('placeholder', 'Title');
        
            deadline.setAttribute('id', 'deadline');
            deadline.setAttribute('type', 'date');
            deadline.setAttribute('value', new Date().toDateInputValue());
            deadline.setAttribute('min', new Date().toDateInputValue());
            
            if (name === 'done') {
                status.setAttribute('checked', true);
                title.setAttribute('disabled', true);
                deadline.setAttribute('disabled', true);
            } else {
                status.checked = false;
                title.disabled = false;
                deadline.disabled = false;
            }
        
            del.setAttribute('id', 'del');
            del.innerHTML = 'del';
            
            item.appendChild(status);
            item.appendChild(title);
            item.appendChild(deadline);
            item.appendChild(del);
            return parent.appendChild(item);
        },

        refreshTasks: function() {
            todoTasks = [];
            doneTasks = [];

            var parentToDo = document.getElementById('todo');

            for (var i = 0; i < parentToDo.children.length; i++) {
                var status = parentToDo.children[i].children[0].checked;
                var title = parentToDo.children[i].children[1].value;
                var deadline = parentToDo.children[i].children[2].value;
                var task = new module.Task(status, title, deadline);
                todoTasks.push(task);
            }           

            var parentDone = document.getElementById('done');

            for (var i = 0; i < parentDone.children.length; i++) {
                var status = parentDone.children[i].children[0].checked;
                var title = parentDone.children[i].children[1].value;
                var deadline = parentDone.children[i].children[2].value;
                var task = new module.Task(status, title, deadline);
                doneTasks.push(task);
            }
            
            localStorage.setItem('todo', JSON.stringify(todoTasks));
            localStorage.setItem('done', JSON.stringify(doneTasks));
        },
        
        removeTask: function(item) {
            var parent = item.parentNode;
            return parent.removeChild(item);    
        },
        
        setDisable: function(item) {
            item.children[1].setAttribute('disabled', true);
            item.children[2].setAttribute('disabled', true);
        },
        
        setEnable: function(item) {    
            item.children[1].disabled = false;
            item.children[2].disabled = false;
        },

        filterByDate: function(list, num) {
            var today = new Date();
            var tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + num);
            
            var nextYear = tomorrow.getFullYear();
            var nextMonth = tomorrow.getMonth() + 1;
            var nextDay = tomorrow.getDate();
        
            for (var i = 0; i < todoTasks.length; i++) {
                var item = todoTasks[i].deadline;
                var itemArr = item.split('-');
                var itemYear = itemArr[0];
                var itemMonth = itemArr[1];
                var itemDay = itemArr[2];
        
                if (!(itemYear == nextYear && itemMonth == nextMonth && itemDay == nextDay)) {
                    list[i].style.display = 'none';                   
                } else {
                    list[i].style.display = 'flex';
                }
            }
            return list;            
        }
    }
}());

window.onload = function() {
    module.init();
}

document.getElementById('container').onclick = function(event) {
    var target = event.target;
    var parent = target.parentNode; 
    
    if (target.tagName === 'BUTTON') {
        if (target.getAttribute('id') === 'add') {
            module.addEmptyTask(module.createTask('todo'));                                        
        } else if (target.getAttribute('id') === 'del') {
            module.removeTask(parent);
            module.refreshTasks();            
        }
    }

    if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {        
        if (target.checked === true) {
            var done = document.getElementById('done');
            done.appendChild(parent);
            module.setDisable(parent);            
        } else if (target.checked === false) {
            var todo = document.getElementById('todo');
            todo.appendChild(parent);  
            module.setEnable(parent);          
        }
        module.refreshTasks();
    }
   
    if (target.tagName === 'SELECT') {
        var list = document.getElementById('todo').children;

        if (target.options.selectedIndex === 0) {
            for (var i = 0; i < list.length; i++) {
                list[i].style.display = 'flex';
            }            
        } else if (target.options.selectedIndex === 1) {
            module.filterByDate(list, 0);
        } else if (target.options.selectedIndex === 2) {
            module.filterByDate(list, 1);
        } else if (target.options.selectedIndex === 3) {
            module.filterByDate(list, 7);
        } 
    }
}

document.getElementById('container').onchange = function(event) {
    var target = event.target;
    var parent = target.parentNode.parentNode;    

    if (parent.getAttribute('id') === 'todo' && (target.getAttribute('id') === 'title' || target.getAttribute('id') === 'deadline')) {
        module.refreshTasks();        
    }
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});