
#CREATING EMPLOYEE MANAGMENT SYSTEM
import pickle
import os

def storeemployee():
    f1=open("employeerecord.dat","ab")
    while True:
        print("\nEnter details of employee:")
        eid=int(input("enter employe ID:"))
        ename=input("enter the employee name:")
        esal=float(input("enter the employe salary:"))
        dept=input("enter the employee department:")
        d1={"eid":eid,"ename":ename,"esal":esal,"dept":dept}
        pickle.dump(d1,f1)
        ch=int(input("want to store more records if yes press 1 if no press 0"))
        if ch==0:
            break
    f1.close()


def viewall():
    f1=open("employeerecord.dat","rb")
    print("\n\nEmployeeID\tEmployeeName\t\tEmployeeSalary\t\tDepatrment")
    try:
        while True:
            d1=pickle.load(f1)
            print(d1["eid"],"\t\t",d1["ename"],"\t\t\t",d1["esal"],"\t\t\t",d1["dept"])
    except EOFError:
        f1.close()


def viewone():
      f1=open("employeerecord.dat","rb")
      empid=int(input("enter the employee id whose record you want to view"))
      fnd=False
      try:
          while True:
              d1=pickle.load(f1)
              if d1["eid"]==empid:
                  fnd=True
                  print("\n\nThe Employee Id is",d1["eid"])
                  print("The Employee name is",d1["ename"])
                  print("The Employee salary is",d1["esal"])
                  print("The Employee departmentis",d1["dept"])
      except EOFError:        
        
    
            f1.close()
      if fnd==False:
              print("This is empid do not exist")
          
    
    

              
def updateemployee():
    
      f1=open("employeerecord.dat","rb+")
      
      empid=int(input("enter the employee id whose record you want to update"))
      fnd=False
      try:
          while True:
              pos=f1.tell()
              
              
              d1=pickle.load(f1)
              if d1["eid"]==empid:
                  fnd=True
                  print("\n\nThe Employee Id is",d1["eid"])
                  print("The Employee name is",d1["ename"])
                  print("The Employee salary is",d1["esal"])
                  print("The Employee departmentis",d1["dept"])
                  nm=input("Enter the new name or enter . for no change in name")
                  if nm!='.':
                      d1["ename"]=nm
                  sal=float(input("enter new salary or -1"))
                  if sal!=-1:
                      d1["esal"]=sal

                  dept=input("enter new dept or .")
                  if dept!='.':
                      d1["dept"]=dept
                  f1.seek(pos)
                  
                  pickle.dump(d1,f1)
                  print("record updated")
                  
      except EOFError:
          f1.close()
          if fnd==False:
              print("This is empid do not exist")
          
         
                  

                                        
                
                      
def deleteemployee():
    f1=open("employeerecord.dat","rb+")
    f2=open("temp.dat","wb")
    empid=int(input("enter the employee id whose record you want to delete"))
    fnd=False
    try:
        while True:
            d1=pickle.load(f1)
            if d1["eid"]==empid:
                fnd=True
                print("\n\nThe Employee Id is",d1["eid"])
                print("The Employee name is",d1["ename"])
                print("The Employee salary is",d1["esal"])
                print("The Employee departmentis",d1["dept"])
                cho=input("ARE YOU SURE YOU WANT TO DELETE THIS RECORD(Y/N0")
                if cho=="Y"or cho=="y":
                    print("record deleted")


                else:
                    pickle.dump(d1,f2)

            else:
                pickle.dump(d1,f2)
    except EOFError:
        f2.close()
        f1.close()
        os.remove("employeerecord.dat")
        os.rename("temp.dat","employeerecord.dat")
    if fnd==False:
        print("This is empid do not exist")
          
      
  
    
    

print("WELCOME TO EMPLOYEE MANAGMENT SYSTEM")
while True:
    print("\nEnter 1 to add record of employee(s)")
    print("Enter 2 to view the record of all employees")
    print("Enter 3 to view one employee on basis of its ID")
    print("Enter 4 to update the record")
    print("Enter 5 to delete a record")
    print("ENter 0 to exit the application")
    cho=int(input("enter your choice here:"))
    if cho==1:
        storeemployee()
    elif cho==2:
        viewall()
    elif cho==3:
        viewone()
    elif cho==4:
         updateemployee()
    elif cho==5:
        deleteemployee()
           
    elif cho==0:
        break
    else:
        print("you have entered wrong choice please write again")