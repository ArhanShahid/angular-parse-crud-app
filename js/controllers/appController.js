app.controller('appController', function($scope,$location) {

    Parse.initialize(" << APP URL >> ", " << APP URL >> ");

    $scope.choice = {
        addNew:true,
        edit:false
    };

    var ContactObject = Parse.Object.extend("ContactClass");
    var query = new Parse.Query("ContactClass");
    var queryForEdit = new Parse.Query("ContactClass");
    var queryDelete = new Parse.Query("ContactClass");

    function findAll(){
        query.find().then(function(result){
            $scope.contactArray = result;
            $scope.$digest();

        },function(error){
            console.log(error);
        });
    }
    findAll();
    $scope.addNew = function(obj){

        console.log(obj);
        var contactObject = new ContactObject();
        contactObject.save({name: obj.name,contact:obj.contact}, {
            success: function(object) {
                $scope.user.name = "";
                $scope.user.contact = "";
                findAll();
            },
            error: function(model, error) {
                console.log('error');
                console.log(error);
            }
        });
    };

    $scope.edit = function(user){
        $scope.editObj = user;
        $scope.choice = {
            addNew:false,
            edit:true
        };
    };
    $scope.editFun = function(editObj){
        console.log(editObj.id);
        queryForEdit.equalTo("objectId", editObj.id);
        queryForEdit.first().then(function(results){

            results.set("name",editObj.attributes.name);
            results.set("contact",editObj.attributes.contact);
            results.save().then(function(editSuccess){
                $scope.editObj.attributes.name = "";
                $scope.editObj.attributes.contact = "";
                $scope.choice = {
                    addNew:true,
                    edit:false
                };
                findAll();
            },function(error){
                console.log(error);
            })
        });
    };

    $scope.delete = function(contact){
        queryDelete.equalTo("objectId", contact);
        queryDelete.find().then(function(results){
            Parse.Object.destroyAll(results).then(function(delResult) {
                findAll();
                console.log("Delete Result Success");
                console.log(delResult);
            });
        },function(error){
            console.log(error);
        })
    };


});
