function task1() {
    console.log("--- Завдання 1 ---");
    let fruits = ["яблуко", "банан", "вишня", "груша"];
    
    fruits.pop();
    console.log(fruits);
    
    fruits.unshift("ананас");
    fruits.sort((a, b) => b.localeCompare(a));
    console.log(fruits);
    
    let index = fruits.indexOf("яблуко");
    console.log(index);
}

function task2() {
    console.log("\n--- Завдання 2 ---");
    let colors = ["червоний", "синій", "зелений", "темно-синій", "жовтий"];
    
    let longest = colors.reduce((a, b) => a.length >= b.length ? a : b);
    let shortest = colors.reduce((a, b) => a.length <= b.length ? a : b);
    console.log(longest, shortest);
    
    let blueColors = colors.filter(color => color.includes("синій"));
    let resultString = blueColors.join(", ");
    console.log(resultString);
}

function task3() {
    console.log("\n--- Завдання 3 ---");
    let employees = [
        { name: "Андрій", age: 25, position: "розробник" },
        { name: "Марія", age: 30, position: "дизайнер" },
        { name: "Олег", age: 22, position: "розробник" }
    ];
    
    employees.sort((a, b) => a.name.localeCompare(b.name));
    
    let developers = employees.filter(e => e.position === "розробник");
    console.log(developers);
    
    employees = employees.filter(e => e.age <= 28);
    
    employees.push({ name: "Іван", age: 24, position: "тестувальник" });
    console.log(employees);
}

function task4() {
    console.log("\n--- Завдання 4 ---");
    let students = [
        { name: "Олексій", age: 19, course: 2 },
        { name: "Тетяна", age: 21, course: 4 },
        { name: "Максим", age: 20, course: 3 }
    ];
    
    students = students.filter(s => s.name !== "Олексій");
    students.push({ name: "Олена", age: 18, course: 1 });
    students.sort((a, b) => b.age - a.age);
    
    let thirdYearStudent = students.find(s => s.course === 3);
    console.log(thirdYearStudent);
    console.log(students);
}

function task5() {
    console.log("\n--- Завдання 5 ---");
    let numbers = [1, 2, 3, 4, 5, 6];
    
    let squares = numbers.map(n => n ** 2);
    console.log(squares);
    
    let evens = numbers.filter(n => n % 2 === 0);
    console.log(evens);
    
    let sum = numbers.reduce((acc, curr) => acc + curr, 0);
    console.log(sum);
    
    let extraNumbers = [10, 20, 30, 40, 50];
    let combined = numbers.concat(extraNumbers);
    
    combined.splice(0, 3);
    console.log(combined);
}

function libraryManagement() {
    console.log("\n--- Завдання 6 ---");
    let library = [
        { title: "Кобзар", author: "Шевченко", genre: "Поезія", pages: 300, isAvailable: true },
        { title: "Тіні забутих предків", author: "Коцюбинський", genre: "Повість", pages: 150, isAvailable: true }
    ];

    function addBook(title, author, genre, pages) {
        library.push({ title, author, genre, pages, isAvailable: true });
    }

    function removeBook(title) {
        library = library.filter(b => b.title !== title);
    }

    function findBooksByAuthor(author) {
        return library.filter(b => b.author === author);
    }

    function toggleBookAvailability(title, isBorrowed) {
        let book = library.find(b => b.title === title);
        if (book) book.isAvailable = !isBorrowed; 
    }

    function sortBooksByPages() {
        library.sort((a, b) => a.pages - b.pages);
    }

    function getBooksStatistics() {
        let total = library.length;
        let available = library.filter(b => b.isAvailable).length;
        let avgPages = library.reduce((acc, b) => acc + b.pages, 0) / total;
        
        return {
            totalBooks: total,
            availableBooks: available,
            borrowedBooks: total - available,
            averagePages: avgPages.toFixed(2)
        };
    }

    addBook("1984", "Орвелл", "Антиутопія", 328);
    toggleBookAvailability("Кобзар", true);
    sortBooksByPages();
    
    console.log(library);
    console.log(getBooksStatistics());
}

function task7() {
    console.log("\n--- Завдання 7 ---");
    let student = {
        name: "Дмитро",
        age: 19,
        course: 2
    };
    
    student.subjects = ["Програмування", "Математика", "Бази даних"];
    delete student.age;
    
    console.log(student);
}

task1();
task2();
task3();
task4();
task5();
libraryManagement();
task7();