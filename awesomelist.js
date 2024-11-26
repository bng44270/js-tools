/*
    AwesomeList - Automate curation of Awesome Lists in Markdown format (https://github.com/sindresorhus/awesome)

    Usage:

        // Instantiate list with description
        var l = new AwesomeList("This is a test list");

        // Populate lists with topics, sub-topics, and links (no technical limit to depth of sub-topics)
        //
        // Function syntax:
        //    <list/topic>.addTopic("Name","Description");
        //    <list/topic>.addLink("Name","URL","Description");
        //
        // NOTE:  Description is optional for the addLink method
        l.addTopic("Programming","links about programming");
        l['Programming'].addTopic("Java","links about Java");
        l['Programming']['Java'].addLink("Java 1","http://java1.com","Java 1 info");
        l['Programming']['Java'].addLink("Java 2","http://java2.com","Java 2 info");
        l['Programming'].addLink("Python 1","http://python.com");

        // Render Markdown
        var md = l.render();
        console.log(md);

        > # This is a test lsit  
        > - Programming  
        >   - Java  
        >     - [Java 1](http://java1.com) - Java 1 info  
        >     - [Java 2](http://java2.com) - Java 2 info  
        >   - [Python 1](http://python.com)  

        // Export JSON text
        var jsonText = l.export();

        // Import JSON text data
        var a = new AwesomeList();
        a.import(jsonText);
*/
class AwesomeList {
    constructor(description) {
        this.description = (description) ? description : null;
    }

    addLink(name,href,description) {
        this[name] = {};
        this[name]['href'] = href;
        this[name]['description'] = (description) ? description : null;
    }

    addTopic(name,description) {
        this[name] = new AwesomeList((description) ? description : null)
    }

    import(obj,notTop) {
        if (!notTop) {
            this['description'] = obj['description'];
        }
        
        delete obj['description'];

        
        Object.keys(obj).forEach(o => {
            if (Object.keys(obj[o]).indexOf('href') == -1) {
                var tName = o;
                var tDescr = obj[o]['description'];
                this.addTopic(tName,tDescr);
                this[tName].import(obj[o],true);
            }
            else {
                var lName = o;
                var lDescr = obj[o]['description'];
                var lLink = obj[o]['href'];
                this.addLink(lName,lLink,lDescr);
            }
        });
    }

    export() {
        return JSON.stringify(this);
    }
    
    render(prefix) {
        var listPrefix = (prefix) ? prefix : "";
        var list = "";

        if (listPrefix.length == 0 && Boolean(this['description']))
            list += `# ${this['description']}  \n`;

        Object.keys(this).forEach(i => {
            if (this[i] instanceof AwesomeList) {
                list += listPrefix + `- ${i}`;
                line += (Boolean(this[i]['description'])) ? ` - ${this[i]['description']}` : '';
                list += '  \n';
                list += this[i].render(listPrefix + '  ');
            }
            else if (i != 'description') {
                var line = `${listPrefix}- [${i}](${this[i]['href']})`;
                line += (Boolean(this[i]['description'])) ? ` - ${this[i]["description"]}` : '';
                line += '  \n';
                list += line;
            }
        });

        list += "  \n  \n*Powered by [awesomelist.js](https://github.com/bng44270/js-tools/blob/main/awesomelist.js)*"
        return list;
    }
}
