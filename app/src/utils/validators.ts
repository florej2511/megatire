import moment from "moment"

type validationFunctions = 'isNumber' | 'minLength' | 'maxLength' | 'email'

class validator {
  private _checked: boolean = true

  public validate(stat: boolean) {
    if (this._checked && !stat) {
      this._checked = false
    }
  }

  public check() {
    return this._checked
  }

}

export class inputValidator extends validator {
  private _char: string = ''
  private _date: boolean = false
  private _dateFormat: string = 'yyyy-mm-dd'

  constructor(char: string) {
    super()
    this._char = char
  }

  public minLength(length: number = 5) {
    this.validate(this._char.length > length)
    return this
  }

  public maxLength(length: number = 5) {
    this.validate(this._char.length < length)
    return this
  }

  public email() {
    const stat = this._char
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    this.validate(stat ? true : false)
    return this
  }

  public changeDateFormat(format: string) {
    this._dateFormat = format
  }

  public isValidDate() {
    const temp = moment(this._char, this._dateFormat).isValid()
    this._date = temp
    this.validate(temp)
    return this
  }

  public dateValidated() {
    if (!this._date) {
      this.isValidDate()
    }
    if (!this._date) {
      return false
    }
    return true
  }

  public minDate(min: string = moment().format(this._dateFormat)) {
    if (!this.dateValidated()) {
      this.validate(false)
    }

    if (!(this._char >= min)) {
      this.validate(false)
    }
    return this
  }

  public maxDate(max: string = moment().format(this._dateFormat)) {
    if (!this.dateValidated()) {
      this.validate(false)
    }
    if (!(this._char <= max)) {
      this.validate(false)
    }
    return this
  }

  public isNumber() {
    this.validate(
      !(typeof this._char == 'string') &&
      isNaN(this._char)
    )
    return this
  }

  public minValue(value: number) {
    this.validate(parseInt(this._char) >= value)
    return this
  }

}

export class formValidator extends validator {
  private _messages: string[] = []

  constructor(obj: any, rules: { name: string, validations: validationFunctions[] }[]) {
    super()
    for (const rule of rules) {
      const input = new inputValidator(obj[rule.name])
      for (const val of rule.validations) {
        input[val]()
      }
      this.validate(input.check())
    }
  }

  public getMessages(): string[] {
    return this._messages
  }

}


