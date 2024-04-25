 var BaseUrl = "https://3fr5xd.sharepoint.com/sites/Success_Point/";
    var listName = "JSOM";
    function getWebProperties() {
    try{
        var ctx =new  SP.ClientContext.get_current();
        this.web = ctx.get_web();
        ctx.load(this.web);
        ctx.executeQueryAsync(Function.createDelegate(this, this.onSuccess),
            Function.createDelegate(this, this.onFail));
            }catch(e)
            {
            alert(e.message);
            }
      
    }
    function onSuccess(sender, args) {
        alert('web title:' + this.web.get_title() + '\n ID:' + this.web.get_id() +
            '\n Created Date:' + this.web.get_created());
    }
    function onFail(sender, args) {
        alert('failed to get list. Error:' + args.get_message());
    }

    function retrieveListItems() {
try{
        var clientContext = new SP.ClientContext(BaseUrl);
        var oList = clientContext.get_web().get_lists().getByTitle(listName);
        
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(
            '<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
            '<Value Type=\'Number\'>1</Value></Geq></Where></Query>' +
            '<RowLimit>10</RowLimit></View>'
        );
        this.collListItem = oList.getItems(camlQuery);

        clientContext.load(collListItem);
        clientContext.executeQueryAsync(
            Function.createDelegate(this, this.onQuerySucceeded),
            Function.createDelegate(this, this.onQueryFailed)
        );
        }catch(e)
        {
        alert(e.message);
        }
    }

    function onQuerySucceeded(sender, args) {
        var listItemInfo = '';
        var listItemEnumerator = collListItem.getEnumerator();

        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            listItemInfo += '\nID: ' + oListItem.get_id() +
                '\nTitle: ' + oListItem.get_item('Title') +
                '\nCity: ' + oListItem.get_item('City') +
                '\nDepartment: ' + oListItem.get_item('Department');
        }

        alert(listItemInfo.toString());
    }

    function onQueryFailed(sender, args) {
        alert('Request failed. ' + args.get_message() +
            '\n' + args.get_stackTrace());
    }
// Create item
    function createListItem() {
    try{
        var clientContext = new SP.ClientContext(BaseUrl);
        var oList = clientContext.get_web().get_lists().getByTitle(listName);

        var itemCreateInfo = new SP.ListItemCreationInformation();
        this.oListItem = oList.addItem(itemCreateInfo);
        oListItem.set_item('Title', document.getElementById('_Title').value) + 
        oListItem.set_item('City', document.getElementById('_City').value) +
        oListItem.set_item('Department', document.getElementById('_Dept').value);
       
        oListItem.update();

        clientContext.load(oListItem);
        clientContext.executeQueryAsync(
            Function.createDelegate(this, this.onQuerySucceeded1),
            Function.createDelegate(this, this.onQueryFailed1)
        );
         }catch(e)
        {
        alert(e.message);
        }
    }

    function onQuerySucceeded1() {
        alert('Item created: ' + oListItem.get_id());
    }

    function onQueryFailed1(sender, args) {
        alert('Request failed. ' + args.get_message() +
            '\n' + args.get_stackTrace());
    }

    function updateListItem() {
        var clientContext = new SP.ClientContext(BaseUrl);
        var oList = clientContext.get_web().get_lists().getByTitle(listName);

        this.oListItem = oList.getItemById(document.getElementById('_TextID').value);
        oListItem.set_item('Title', document.getElementById('_TextTitle').value);
        oListItem.update();

        clientContext.executeQueryAsync(
            Function.createDelegate(this, this.onQuerySucceeded2),
            Function.createDelegate(this, this.onQueryFailed1)
        );
    }

    function onQuerySucceeded2() {
        alert('Item updated!');
    }
   
    function deleteListItem() {
        //this.itemId =2;
        var clientContext = new SP.ClientContext(BaseUrl);
        var oList = clientContext.get_web().get_lists().getByTitle(listName);
        this.oListItem = oList.getItemById(document.getElementById('_TextDeleteID').value);
        oListItem.deleteObject();

        clientContext.executeQueryAsync(
            Function.createDelegate(this, this.onQuerySucceeded3),
            Function.createDelegate(this, this.onQueryFailed)
        );
    }

    function onQuerySucceeded3() {
        alert('Item deleted');
    }

  
