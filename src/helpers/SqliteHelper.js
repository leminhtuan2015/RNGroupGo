var SQLite = require('react-native-sqlite-storage')

class SqliteHelper {
    static errorCallback(err) {
        console.log("___SQL Error: " + err);
    }

    static successCallback() {
        console.log("___SQL executed fine");
    }

    static openCallback() {
        console.log("___SQL Database OPENED");
    }

    static dbInfo = {
        name: "database",
        createFromLocation: "~sqlite/data.db",
    }

    static db = SQLite.openDatabase(
        SqliteHelper.dbInfo,
        SqliteHelper.successCallback,
        SqliteHelper.errorCallback
    );

    select() {
        SqliteHelper.db.transaction((tx) => {
            tx.executeSql('SELECT * FROM playlists', [], (tx, results) => {
                console.log("Query completed");

                // Get rows with Web SQL Database spec compliance.

                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    console.log("sqlite data : " + row["Name"]);
                }

                // Alternatively, you can use the non-standard raw method.
                /*
                    let rows = results.rows.raw(); // shallow copy of rows Array
                    rows.map(row => console.log(`Employee name: ${row.name}, Dept Name: ${row.deptName}`));
                */
            });
        });
    }

}

export default SqliteHelper
