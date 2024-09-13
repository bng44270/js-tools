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

        list += "  \n  \n*Powered by [awesomelist.js]()*"
        return list;
    }
}
